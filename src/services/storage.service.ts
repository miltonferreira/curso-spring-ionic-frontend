import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { Cart } from "../models/cart";

@Injectable()
export class StorageService{
    // STORAGE armazena localmente valores para reuso


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

    getCart() : Cart { // recebe um cart e armazena no storage
        let str = localStorage.getItem(STORAGE_KEYS.cart);
        if (str != null) {
            return JSON.parse(str);
        }
        else {
            return null;
        }
    }

    setCart(obj : Cart) { // recebe um cart e armazena no storage
        if (obj != null) {
            localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(obj));
        } 
        else {
            localStorage.removeItem(STORAGE_KEYS.cart);
        }
    }

}