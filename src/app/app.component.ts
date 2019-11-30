import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // controlador da view app.html, o @Component é o controlador

  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage'; // indica quem é a pagina inicial do app

  pages: Array<{title: string, component: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public auth: AuthService) {
    
      this.initializeApp();

    // lista de opções de navegação no menu Toggle
    this.pages = [
      { title: 'Profile', component: 'ProfilePage' },
      { title: 'Categorias', component: 'CategoriasPage' },
      { title: 'Logout', component: '' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page : {title:string, component:string}) {

    switch(page.title){
      case 'Logout':
        this.auth.logout(); // remove token do app
        this.nav.setRoot('HomePage'); // volta para a pagina de login
        break;

      default:
        this.nav.setRoot(page.component); // navega pelas páginas
    }

    
  }
}
