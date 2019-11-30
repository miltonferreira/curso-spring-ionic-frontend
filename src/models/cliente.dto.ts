export interface ClientDTO{
    id : string;
    nome : string;
    email : string;

    imageUrl? : string; // com ? indica que é opcional na requisição

}