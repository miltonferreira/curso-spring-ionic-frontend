import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CategoriaDTO } from "../../models/categorias.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CategoriaService{
    // classe pega lista de categorias do backend
    
    constructor(public http: HttpClient){

    }

    // funçao retorna uma lista de categoriasDTO
    findAll() : Observable<CategoriaDTO[]>{
        return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`); // faz chamada de categorias do backend
    }

}