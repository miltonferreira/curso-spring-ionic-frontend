import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { // a requisição passa por esse metodo
        
        let localUser = this.storage.getLocalUser();

        let N = API_CONFIG.baseUrl.length; // pega o tamanho em caracteres da requisição para a API/Heroku

        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl; // compara se o tamanho é igual

        if(localUser && requestToAPI){

            // clona a requisição pegando o token com cabeçalho, acrescenta o cabeçalho se for para a API. Evitando acrescenta para o S3
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
            return next.handle(authReq) // continua requisição

        } else {
            return next.handle(req) // continua requisição, sem cabeçalho
        }

    }

}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};