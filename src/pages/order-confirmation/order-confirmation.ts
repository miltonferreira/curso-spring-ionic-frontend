import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClientDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {
  // finaliza pedido do cliente

  pedido: PedidoDTO;
  cartItems: CartItem[]; // lista para mostra os itens do carrinho
  cliente: ClientDTO;
  endereco: EnderecoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService) {

    this.pedido = this.navParams.get('pedido'); // pega o parametro de ? para pegar Id do cliente
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items; // pega os itens do carrinho

    this.clienteService.findById(this.pedido.cliente.id) // busca o cliente pelo id no BD, pegando todos os dados dele
      .subscribe(response => {
        this.cliente = response as ClientDTO;
        // pega o endereco do BD indicado pelo id
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error =>{
        this.navCtrl.setRoot('HomePage'); // se acontecer algum erro, retorna para a tela de login
      });
  }

  // retorna o endereco indicado pelo id
  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id); // procura na lista de enderecos e retorna a posicao indicado pelo id
    return list[position]; //retorna o endereco indicado pelo id
  }

  total(){
    return this.cartService.total();
  }

  back(){
    this.navCtrl.setRoot('CartPage'); // retorna para a pagina de carrinho
  }

  //envia o pedido para o BD no backend
  checkout(){
    this.pedidoService.insert(this.pedido)
    .subscribe(response => {
      this.cartService.createOrClearCart(); // limpa o carrinho ao finalizar o pedido
      // pega a resposta do cabeçalho o caminho do pedido salvo no BD
      console.log(response.headers.get('location'));
    },
    error => {
      if(error.status == 403){ // erro de autenticação ou autorização
        this.navCtrl.setRoot('HomePage'); // retorna a tela de login
      }
    });
  }

}
