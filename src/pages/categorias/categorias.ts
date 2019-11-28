import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categorias.services';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  ionViewDidLoad() {
    this.categoriaService.findAll() // chamada assincrona se inscrevendo para recebe a resposta da lista de categorias
      .subscribe(response => {
        console.log(response); // para cada reposta imprime a categoria
    },
    error => {
      console.log(error); // mostra o erro caso aconteça
    });

  }

}
