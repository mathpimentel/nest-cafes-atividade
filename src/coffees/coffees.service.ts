// src/coffees/coffees.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cafe, Pedido, ItemPedido, TagCafe } from '@prisma/client'; 
import { CreateCoffeeDto } from './dto/create-coffee.dto' 

export interface CafeWithTagsOutput {
  id: number;
  nome: string;
  tags?: string[]; 
}

export interface TopCoffeeResult {
  cafe?: Cafe;
  totalQuantity: number | null;
}

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDetalhesCafe(id: number): Promise<Cafe | null> {
    const cafe = await this.prisma.cafe.findUnique({
      where: { id: id },
    });
    if (!cafe) {
      throw new NotFoundException(`Café com ID ${id} não encontrado.`);
    }
    return cafe;
  }

  
  async createCoffee(createCoffeeDto: CreateCoffeeDto): Promise<Cafe> {
    const { tags, ...dataToCreate } = createCoffeeDto;

    const newCafe = await this.prisma.cafe.create({
      data: {
        ...dataToCreate,
        tags: {
          create: tags?.map(tagName => ({ nome: tagName })) || [],
        },
      },
    });

    return newCafe;
  }

  async getAllCoffeesWithTags(): Promise<CafeWithTagsOutput[]> {
    const coffees = await this.prisma.cafe.findMany({
      include: {
        tags: true,
      },
    });

    return coffees.map(cafe => ({
      id: cafe.id,
      nome: cafe.nome,
      tags: cafe.tags.map(tag => tag.nome),
    }));
  }

  async getOrdersByCoffeeId(cafeId: number): Promise<Pedido[]> {
    const orders = await this.prisma.pedido.findMany({
      where: {
        itens: {
          some: {
            cafeId: cafeId,
          },
        },
      },
      include: {
        itens: { 
          include: {
            cafe: true, 
          },
        },
        cliente: true, 
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException(`Nenhum pedido encontrado para o café com ID ${cafeId}.`);
    }

    return orders;
  }

  
  async getTop3MostOrderedCoffees(): Promise<TopCoffeeResult[]> {
  
    const topCoffeesRaw = await this.prisma.itemPedido.groupBy({
      by: ['cafeId'],
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc', 
        },
      },
      take: 3, 
    });

    const topCoffeeIds = topCoffeesRaw.map(item => item.cafeId);
    const topCafeDetails = await this.prisma.cafe.findMany({
      where: {
        id: {
          in: topCoffeeIds,
        },
      },
    });

    if(!topCoffeesRaw){
      return [];
    } 

    const topCoffees: TopCoffeeResult[] = topCoffeesRaw.map(raw => {

      const cafe = topCafeDetails.find(c => c.id === raw.cafeId);
      return {
        cafe: cafe,
        totalQuantity: raw._sum.quantidade,
      };
    }).filter(result => result.cafe !== undefined); 

    return topCoffees;
  }

  async deleteCoffee(id: number): Promise<{ message: string }> {
    const existingCafe = await this.prisma.cafe.findUnique({
      where: { id: id },
    });

    if (!existingCafe) {
      throw new NotFoundException(`Café com ID ${id} não encontrado.`);
    }
    await this.prisma.tagCafe.deleteMany({
      where: { cafeId: id },
    });
    await this.prisma.itemPedido.deleteMany({
      where: { cafeId: id },
    });
    await this.prisma.cafe.delete({
      where: { id: id },
    });
    return { message: `Café com ID ${id} deletado com sucesso.` };
  }
}
