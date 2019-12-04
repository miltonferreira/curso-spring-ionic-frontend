import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categorias.services';
import { CategoriaDTO } from '../../models/categorias.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {
  // controlador do categorias.html

  bucketUrl: string = API_CONFIG.bucketBaseUrl; // pega a url base das imagens no S3

  items: CategoriaDTO[]; // lista de categorias

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  ionViewDidLoad() {
    this.categoriaService.findAll() // chamada assincrona se inscrevendo para recebe a resposta da lista de categorias
      .subscribe(response => {
        this.items = response; // adiciona as categorias na lista
    },
    error => {
      // console.log(error); // mostra o erro caso aconteça
    });

  }

  showProdutos(categoria_id : string){
    this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id}); // empilha a pagina de produtos, categoria_id: é o nome
  }

}
