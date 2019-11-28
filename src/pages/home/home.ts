import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html' // indica qual view está controlando
})
export class HomePage {
  // controlador da view home.html, o @Component é o controlador

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false); // desabilita o menu lateral
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true); // habilita o menu lateral
  }

  login(){
    // metodo chama a pagina categorias na home // push empilha as paginas, setRoot somente vai sem voltar
    this.navCtrl.setRoot('CategoriasPage');
  }

}
