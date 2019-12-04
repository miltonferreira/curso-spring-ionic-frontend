import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CidadeDTO } from "../../models/cidade.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CidadeService{
    // classe pega lista de cidades do backend
    
    constructor(public http: HttpClient){

    }

    // funçao retorna as cidades de um estado indicado pelo estado_id
    findAll(estado_id : string) : Observable<CidadeDTO[]> {
        return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${estado_id}/cidades`); // faz chamada de cidades do backend
    }

}