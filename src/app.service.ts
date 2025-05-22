import { Injectable, BadRequestException } from '@nestjs/common';

export interface Cafe{
  nome: string;           // obrigatório
  tipo: string;           // obrigatório
  quantidade?: number;
  preco?: number;
  id: string;             // obrigatório
  descricao?: string;
  tags?: string[];
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly cafes: Cafe[] = [ {
    "nome": "Encanto",
    "tipo": "Suave",
    "quantidade": 2,
    "preco": 22.0,
    "id": "30",
    "descricao": "Bebida delicada com notas florais e toque de frutas vermelhas.",
    "tags": ["floral", "frutas vermelhas", "suave"]
  }]

  getDetalhesCafe(id:string) : Cafe | undefined{
    return this.cafes.find( cafe => cafe.id === id)
  }

  createCoffee(cafe : Cafe){
    if(!cafe.nome) {
      throw new BadRequestException('O nome é obrigatório');
    }
    if(!cafe.tipo){
      throw new BadRequestException('O tipo é obrigatório');
    }
    if(!cafe.id){
      throw new BadRequestException('O id é obrigatório');
    }
    this.cafes.push(cafe)
  }
}
