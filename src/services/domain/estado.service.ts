import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { EstadoDTO } from "../../models/estado.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class EstadoService{
    // classe pega lista de estados do backend
    
    constructor(public http: HttpClient){

    }

    // funçao retorna uma lista de estadosDTO
    findAll() : Observable<EstadoDTO[]>{
        return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`); // faz chamada de estados do backend
    }

}