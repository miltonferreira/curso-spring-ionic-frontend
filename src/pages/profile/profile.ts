import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClientDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClientDTO;
  picture: string; // imagem imagem base64
  profileImage; // imagem do perfil
  cameraOn: boolean = false; // controla se ativa/desativa botao de tirar foto

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
    public sanitizer: DomSanitizer) {

      this.profileImage = 'assets/imgs/avatar-blank.png'; // caso nao encontre a imagem, usa a imagem padrao
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser(); //pega o valor de localUser do storage caso exista

    if(localUser && localUser.email){
      
      this.clienteService.findByEmail(localUser.email) //indica qual email quer pegar no BD
      .subscribe(response => {
        this.cliente = response as ClientDTO; // pega o clienteDTO do backEnd na resposta da requisição
        this.getImageIfExists() // buscar imagem para avatar do cliente

      },
      error => {
        if (error.status == 403){
          this.navCtrl.setRoot('HomePage'); // caso aconteça erro de autenticaçãodo token, retorna para a página de login
        }
      });

    } else {
      this.navCtrl.setRoot('HomePage'); // caso aconteça erro de autenticação do token, retorna para a página de login
    }
  }

  // verifica se a imagem existe
  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
    .subscribe(response => {
      this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      this.blobToDataURL(response).then(dataUrl => {
        let str : string = dataUrl as string; // indica a imagem do avatar do profile
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
      })
    },
    error =>{
      this.profileImage = 'assets/imgs/avatar-blank.png'; // caso nao encontre a imagem, usa a imagem padrao
    });
  }

  // converte blob para base64
  blobToDataURL(blob){
    return new Promise((fulfill, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    })
  }

  // pega imagem da camera do celular/cam
  getCameraPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false; // caso nao tire foto, permite que tire novamente
    });
  }

  getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false; // caso nao tenha escolhido uma imagem, permite que vá para a galeria
    });
  }

  // envia imagem do cliente para o S3
  sendPicture(){
    this.clienteService.uploadPicture(this.picture) // indica a foto tirada pela cam para enviar ao S3
      .subscribe(response => {
        this.picture = null;
        this.getImageIfExists(); // recarrega novamente a imagem de perfil
      },
      error =>{

      });
  }

  // descarta imagem
  cancel(){
    this.picture = null;
  }

}
