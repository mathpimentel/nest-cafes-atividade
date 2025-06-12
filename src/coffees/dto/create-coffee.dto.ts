export class CreateCoffeeDto {
    nome: string;
    tipo: string;
    preco: number;
    descricao: string;
    tags?: string[];
  }