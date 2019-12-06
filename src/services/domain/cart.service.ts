import { StorageService } from "../storage.service";
import { Injectable } from "@angular/core";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable() // indica que injeta depedencias de outras classes
export class CartService{

    constructor(public storage: StorageService){

    }

    // 
    createOrClearCart() : Cart {
        let cart: Cart = {items: []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        let cart: Cart = this.storage.getCart(); // retorna o cart que tem no storage

        if(cart == null){
            cart = this.createOrClearCart(); // ou cria um novo cart, caso nao exista
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart{
        let cart = this.getCart();
        // procura na lista um produto igual indicado no parametro do metodo, se existe retorna a posição ou -1 se nao existe
        let position = cart.items.findIndex(x => x.produto.id == produto.id);

        if(position == -1){ // se nao existe o item na lista
            cart.items.push({quantidade: 1, produto: produto}); // add
        }
        this.storage.setCart(cart); // atualiza o cart no storage
        return cart;
    }

}