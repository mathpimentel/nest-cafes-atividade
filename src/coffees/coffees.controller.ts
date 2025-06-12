import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CoffeesService, CafeWithTagsOutput, TopCoffeeResult } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Cafe, Pedido } from '@prisma/client';

@Controller()
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  getHello(): string {
    return this.coffeesService.getHello();
  }

  @Get('/coffees/:id/detalhes')
  async getDetalhesCafe(@Param('id', ParseIntPipe) id: number): Promise<Cafe | null> {
    return this.coffeesService.getDetalhesCafe(id);
  }

  @Post('/coffees')
  @HttpCode(HttpStatus.CREATED) 
  async createCoffee(@Body() createCafeDto: CreateCoffeeDto): Promise<Cafe> {
    return this.coffeesService.createCoffee(createCafeDto);
  }

  @Get('/coffees')
  async getAllCoffees(): Promise<CafeWithTagsOutput[]> {
    return this.coffeesService.getAllCoffeesWithTags();
  }

  @Get('/coffees/:id/order')
  async getOrdersForSpecificCoffee(@Param('id', ParseIntPipe) id: number): Promise<Pedido[]> {
    return this.coffeesService.getOrdersByCoffeeId(id);
    }
  
  @Get('/coffees/plus-order-coffee')
  async getTopOrderedCoffees(): Promise<TopCoffeeResult[]> {
    return this.coffeesService.getTop3MostOrderedCoffees();
  }
  
  @Delete('/coffees/:id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async deleteCoffee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.coffeesService.deleteCoffee(id);
  }
}
