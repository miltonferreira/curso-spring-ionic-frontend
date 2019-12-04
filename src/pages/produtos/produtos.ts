import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[]; // coleção de produtos

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtosService: ProdutoService) {
  }

  ionViewDidLoad() {

    let categoria_id = this.navParams.get('categoria_id'); // pega o parametro do metodo showProdutos do categorias.ts

    this.produtosService.findByCategoria(categoria_id) // indica qual é a categoria dos items
    .subscribe(response => {
      this.items = response['content']; // pega o conteudo paginado do content
    },
    error => {});

  };

}
