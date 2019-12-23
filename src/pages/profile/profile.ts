import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClientDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClientDTO;
  picture: string; // imagem imagem base64
  cameraOn: boolean = false; // controla se ativa/desativa botao de tirar foto

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera) {
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
    },
    error =>{});
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
    });
  }

  // envia imagem do cliente para o S3
  sendPicture(){
    this.clienteService.uploadPicture(this.picture) // indica a foto tirada pela cam para enviar ao S3
      .subscribe(response => {
        this.picture = null;
        this.loadData(); // recarrega novamente a pagina de perfil
      },
      error =>{

      });
  }

  // descarta imagem
  cancel(){
    this.picture = null;
  }

}
