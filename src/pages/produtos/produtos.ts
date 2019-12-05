import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {
  // lista os produtos quando for chamado o produtos.html

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
      this.loadImageUrls(); // ao pegar os produtos, chama as imagens do produto
    },
    error => {});

  };

  // mostra as imagens dos produtos
  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) {
      let item = this.items[i];
      this.produtosService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`; // atribui o link da imagem ao produto
          
        },
        error => {});
    }
  }

  // chama a pagina do produto ao clicar
  showDetail(){
    this.navCtrl.push('ProdutoDetailPage'); // chama o produto-detail.ts
  }

}
