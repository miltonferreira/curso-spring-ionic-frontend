import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
    public produtosService: ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad(){
    this.loadData();
  }

  loadData() {

    let categoria_id = this.navParams.get('categoria_id'); // pega o parametro do metodo showProdutos do categorias.ts

    let loader = this.presentLoading(); // mostra a tela de loading

    this.produtosService.findByCategoria(categoria_id) // indica qual é a categoria dos items
    .subscribe(response => {
      this.items = response['content']; // pega o conteudo paginado do content
      loader.dismiss(); // fecha a tela de loading, quando obter resposta
      this.loadImageUrls(); // ao pegar os produtos, chama as imagens do produto
    },
    error => {
      loader.dismiss(); // fecha a tela de loading, caso tenha acontecido algum erro
    });

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
  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id}); // chama o produto-detail.ts
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    loader.present();
    return loader;
  }

  doRefresh(refresher) {

    this.loadData(); // carrega novamente infos da pagina

    setTimeout(() => {
      refresher.complete();
    }, 1000); // depois de 1 segundo executa o loadData()
  }

}
