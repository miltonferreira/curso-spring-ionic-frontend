import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClientDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class ClienteService {
    
    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageUtilService: ImageUtilService){

    }

    // pega as infos do cliente, para verificar se o cliente logado é o mesmo cliente do pedido
    findById(id: string) {
        
        // pega o id do cliente no restful do BD
        return this.http.get<ClientDTO>(`${API_CONFIG.baseUrl}/clientes/${id}`);
            
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

    // envia imagem do cliente para o S3
    uploadPicture(picture){
        
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture); // converte imagem para blob
        let formData : FormData = new FormData(); // instancia o formData pois a imagem é enviada por ele

        formData.set('file', pictureBlob, 'file.png'); // indica qual arquivo enviar para o S3

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData, // passa o formData como post para o S3
            {
                observe: 'response', // espera uma resposta
                responseType: 'text' // tipo texto, pois pode acontecer um erro de parse Json
            }
        );

    }

}