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

  items : ProdutoDTO[] = []; // coleção de produtos com lista vazia

  page : number = 0; //paginas carregadas a cada chamada do doInfinite

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

    this.produtosService.findByCategoria(categoria_id, this.page, 10) // indica qual é a categoria dos items, buscando de 10 em 10
    .subscribe(response => {
      let start = this.items.length; // pega o tamanho inicial da lista
      this.items = this.items.concat(response['content']); // pega o conteudo paginado do content e concatena com o que já tem de itens
      let end = this.items.length - 1; // pega o tamanho da lista depois de concatenar
      loader.dismiss(); // fecha a tela de loading, quando obter resposta
      console.log(this.page);
      console.log(this.items);
      // ao pegar os produtos, chama as imagens do produto.
      this.loadImageUrls(start, end); // Chamando somente uma vez quando carregar com start e end
    },
    error => {
      loader.dismiss(); // fecha a tela de loading, caso tenha acontecido algum erro
    });

  };

  // mostra as imagens dos produtos
  loadImageUrls(start: number, end: number) {
    for (var i=start; i<end; i++) {
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

    // reseta a paginação quando acontecer o refresh no canto superior da pagina
    this.page = 0;
    this.items = [];

    this.loadData(); // carrega novamente infos da pagina

    setTimeout(() => {
      refresher.complete();
    }, 1000); // depois de 1 segundo executa o loadData()
  }

  doInfinite(infiniteScroll) {

    this.page++; // incrementa +1 quando chegar no final da pagina

    this.loadData(); // chamando novamente o metodo que carrega mais items

    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);

  }

}
