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

    // pega todas infos do cliente, inclusive os endereços, nao possui tipagem de ClienteDTO
    findByEmail(email: string) {
        
        // pega o email no restful do BD
        return this.http.get<ClientDTO>(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
            
    }

    // pega a imagem do cliente
    getImageFromBucket(id : string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg` // pega o caminho da imagem
        return this.http.get(url, {responseType : 'blob'}); // indica que a resposta da requisição é uma imagem 'blob'
    }

    // salva um novo cliente no BD
    insert(obj : ClientDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj, // passa o obj como post
            {
                observe: 'response', // espera uma resposta
                responseType: 'text' // tipo texto, pois pode acontecer um erro de parse Json
            }
        );
    }

}