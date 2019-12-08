import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDTO } from "../../models/pedido.dto";

@Injectable()
export class PedidoService{
    // classe para enviar o pedido ao backend
    
    constructor(public http: HttpClient){

    }
    
    insert(obj: PedidoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`,
            obj,
            {
              observe: 'response', //
              responseType: 'text' // indica que a resposta é em texto, mas vem vazio  
            }
        );
    }
    
}