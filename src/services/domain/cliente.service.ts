import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClientDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {
    
    constructor(public http: HttpClient, public storage: StorageService){

    }

    // pega as infos do cliente
    findByEmail(email: string) : Observable<ClientDTO> {

        let token = this.storage.getLocalUser().token; // pega o token
        let authHeader = new HttpHeaders({'Authorization': 'Bearer ' + token}) // cabeçalho que vai mandar na requisição

        // pega o email no restful do BD
        return this.http.get<ClientDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            {'headers': authHeader}); 
    }

    // pega a imagem do cliente
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg` // pega o caminho da imagem
        return this.http.get(url, {responseType : 'blob'}); // indica que a resposta da requisição é uma imagem 'blob'
    }

}