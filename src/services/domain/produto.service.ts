import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { ProdutoDTO } from '../../models/produto.dto';

@Injectable()
export class ProdutoService {

  constructor(public http: HttpClient) {
  }

  // pega o id do produto
  findById(produtos_id : string){
    return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${produtos_id}`);
  }

  // busca a categoria no backEnd
  findByCategoria(categoria_id : string) {
    return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
  }

  // busca no backend as imagens pequenas dos produtos
  getSmallImageFromBucket(id : string) : Observable<any>{
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
    return this.http.get(url, {responseType : 'blob'}); // blob é para indicar que é uma imagem
  }

  // busca no backend as imagens grande dos produtos
  getImageFromBucket(id : string) : Observable<any>{
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
    return this.http.get(url, {responseType : 'blob'}); // blob é para indicar que é uma imagem
  }

}