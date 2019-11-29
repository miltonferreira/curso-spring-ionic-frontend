import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html' // indica qual view está controlando
})
export class HomePage {
  // controlador da view home.html, o @Component é o controlador

  creds : CredenciaisDTO = { // recebe o login do usuario
    email: "",
    senha: "" 
  };

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false); // desabilita o menu lateral
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true); // habilita o menu lateral
  }

  login(){
    console.log(this.creds);
    // metodo chama a pagina categorias na home // "push" empilha as paginas - "setRoot" somente vai sem voltar
    this.navCtrl.setRoot('CategoriasPage');
  }

}
