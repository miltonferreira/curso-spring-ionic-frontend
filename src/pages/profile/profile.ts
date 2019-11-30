import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClientDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClientDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser(); //pega o valor de localUser do storage caso exista
    if(localUser && localUser.email){
      
      this.clienteService.findByEmail(localUser.email) //indica qual email quer pegar no BD
      .subscribe(response => {
        this.cliente = response; // pega o clienteDTO do backEnd na resposta da requisição
        this.getImageIfExists() // buscar imagem para avatar do cliente

      },
      error =>{});

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

}
