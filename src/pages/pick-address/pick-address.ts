import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {
  // classe que pega os endereços de entrega

  items: EnderecoDTO[]; // coleção de endereços

  pedido: PedidoDTO; //recebe informações do cliente, produtos e local de entrega

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  ionViewDidLoad() {

    let localUser = this.storage.getLocalUser(); //pega o valor de localUser do storage caso exista

    if(localUser && localUser.email){
      
      this.clienteService.findByEmail(localUser.email) //indica qual email quer pegar no BD
      .subscribe(response => {
        this.items = response['enderecos']; // pega os campos endereço do backEnd na resposta da requisição

        let cart = this.cartService.getCart(); // pega o carrinho armazenado no localStorage

        // cria um novo obj de pedido
        this.pedido = {
          cliente: {id: response['id']}, // pega o id da resposta JSON do backend
          enderecoDeEntrega: null, // o cliente ainda não escolheu o endereço de entrega nesse momento
          pagamento: null, // o cliente ainda não escolheu forma de pagamento
          itens: cart.items.map(x => { return {quantidade: x.quantidade, produto: {id: x.produto.id}} }) // pega quantidade e id do produto no JSON do backend
        }

      },
      error => {
        if (error.status == 403){
          this.navCtrl.setRoot('HomePage'); // caso aconteça erro de autenticaçãodo token, retorna para a página de login
        }
      });

    } else {
      this.navCtrl.setRoot('HomePage'); // caso aconteça erro de autenticação do token, retorna para a página de login
    }

  }

  // indica qual endereço de entrega
  nextPage(item: EnderecoDTO){
    this.pedido.enderecoDeEntrega = {id: item.id}; // pega somente o id do endereço
    console.log(this.pedido);
  }

}
