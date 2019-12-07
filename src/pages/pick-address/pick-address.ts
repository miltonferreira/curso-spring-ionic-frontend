import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {
  // classe que pega os endereços de entrega

  items: EnderecoDTO[]; // coleção de endereços

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
        this.items = response['enderecos']; // pega os campos endereço do backEnd na resposta da requisição

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

}
