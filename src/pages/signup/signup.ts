import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[]; // coleção de estado armazenados
  cidades: CidadeDTO[]; // coleção de cidades armazenadas

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService) {

      this.formGroup = this.formBuilder.group({ // formBuilder instancia um formGroup

        // colocando requisitos nos campos obrigatorios, parecido como no backEnd
        nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['Joaquim@gmail.com', [Validators.required, Validators.email]],
        tipo : ['1', [Validators.required]],
        cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha : ['123', [Validators.required]],
        logradouro : ['Rua Via', [Validators.required]],
        numero : ['25', [Validators.required]],
        complemento : ['Apto 3', []],
        bairro : ['Copacabana', []],
        cep : ['10828333', [Validators.required]],
        telefone1 : ['977261827', [Validators.required]],
        telefone2 : ['', []],
        telefone3 : ['', []],
        estadoId : [null, [Validators.required]],
        cidadeId : [null, [Validators.required]]      

      });
  }

  ionViewDidLoad(){
    // ao carregar a página de cadastro, carrega a lista de estados
    this.estadoService.findAll()
    .subscribe(response => {
      this.estados = response; // a coleção recebe os estados do backend
      this.formGroup.controls.estadoId.setValue(this.estados[0].id); // pega o primeiro estado da coleção
      this.updateCidades(); // busca as cidades correspondentes ao estado selecionado
    },
    error =>{});
  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId; // pega o estado que está selecionado
    
    this.cidadeService.findAll(estado_id) // pega as cidades baseado no id indicado no parametro
    .subscribe(response => {
      this.cidades = response; // adiciona as cidades na coleção
      this.formGroup.controls.cidadeId.setValue(null); // remove a cidade selecionada anteriormente
    },
    error =>{});
  }

  signupUser(){
    console.log("Enviou o form");
  }

}
