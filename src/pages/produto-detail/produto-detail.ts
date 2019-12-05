import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {
  // infos do produto e imagem

  item: ProdutoDTO;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }

  // infos do produto
  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id'); // pega o id do item do click em produtos.ts
    this.produtoService.findById(produto_id)
    .subscribe(response => {
      this.item = response;
      this.getImageIfExists(); // carrega a imagem do produto
    },
    error =>{});
  }

  // verifica se a imagem do produto existe
  getImageIfExists(){
    this.produtoService.getImageFromBucket(this.item.id) // pega o id do produto carregado
    .subscribe(response => {
      this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.item.id}.jpg`;
    },
    error =>{});
  }

}
