import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{
    // responsavel pela credencial do usuario

    constructor(public http: HttpClient, public storage: StorageService){

    }

    // envia o email e senha para autenticar o usuario
    authenticate(creds : CredenciaisDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            creds,
            {
                observe: 'response', // pega o header da resposta e indica que vai recebe um obj response
                responseType: 'text' // indica que o tipo da resposta é em texto
            })
    }

    // caso tenha sucesso em logar, salva o usuario no localStorage
    successfulLogin(authorizationValue : string){
        let tok = authorizationValue.substring(7); // pega o token tirando o beader
        let user : LocalUser = {
            token: tok
        };
        this.storage.setLocalUser(user); // salva o usuario no localStorage
    }

    logout(){
        this.storage.setLocalUser(null); // remove o usuario no localStorage
    }

}