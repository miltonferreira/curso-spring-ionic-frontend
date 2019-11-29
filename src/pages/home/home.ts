import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService) {

  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false); // desabilita o menu lateral
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true); // habilita o menu lateral
  }

  login(){
    this.auth.authenticate(this.creds)
    .subscribe(response => {
      console.log(response.headers.get('Authorization')); // pega no header para checa se o Authorization veio na resposta
      // metodo chama a pagina categorias na home : "push" empilha as paginas - "setRoot" somente vai sem voltar
      this.navCtrl.setRoot('CategoriasPage');
    },
    error =>{});
    
  }

}
