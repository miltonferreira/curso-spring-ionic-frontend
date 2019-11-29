import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";

@Injectable()
export class StorageService{


    getLocalUser() : LocalUser { // retorna o usuario logado

        let usr = localStorage.getItem(STORAGE_KEYS.localUser); // pega o valor que tiver no localStorage

        if(usr == null){
            return null;
        } else {
            return JSON.parse(usr); // se o valor existir converte para json, pois o storage armazena string's
        }

    }

    setLocalUser(obj : LocalUser){ // recebe um local_user e armazena no storage

        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.localUser); // remove o usuario no localStorage, usando no logout do  auth.service.ts
        } else {
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj)); // indica que quer armazena o valor convertendo para string o json
        }

    }

}