import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(public storage: StorageService, public alertCtrl: AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { // a requisição passa por esse metodo
        //console.log("Passou no Interceptor");
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

            switch(errorObj.status){
                case 401: // erro de autenticação, email ou senha errada
                    this.handle401();
                    break;

                case 403: // erro com token
                    this.handle403();
                    break;

                default:
                this.handleDefaultError(errorObj);
                break;
            }

            return Observable.throw(errorObj); // propaga o erro
        }) as any;
    }

    handle403(){
        this.storage.setLocalUser(null); // remove o localUser pois ele pode ser invalido
    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, // obriga apertar botão para fechar
            buttons:[
                {
                    text: 'OK'
                }
            ]
        });
        alert.present(); // mostra o alert na tela
    }

    // mostra outros erros que possam ocorrer
    handleDefaultError(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false, // obriga apertar botão para fechar
            buttons:[
                {
                    text: 'OK'
                }
            ]
        });
        alert.present(); // mostra o alert na tela
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};