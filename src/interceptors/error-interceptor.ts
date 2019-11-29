import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { // a requisição passa por esse metodo
        console.log("Passou no Interceptor");
        return next.handle(req) // continua requisição
        .catch((error, caught) => { // se acontecer algum erro é capturado pelo catch

            let errorObj = error; // pega o erro
            if(errorObj.error){
                errorObj = errorObj.error;
            }
            if(!errorObj.status){ // se o obj do error nao for json
                errorObj = JSON.parse(errorObj); // faz a conversão
            }

            // agora o Interceptor que vai exibir log de erro na tela
            console.log("Erro detectado pelo Interceptor");
            console.log(errorObj);

            return Observable.throw(errorObj); // propaga o erro para categorias.ts
        }) as any;
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};