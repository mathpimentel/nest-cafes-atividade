import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService, Cafe } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/coffees/:id/detalhes')
  getDetalhesCafe(@Param('id') id: string) : Cafe | undefined{
    return this.appService.getDetalhesCafe(id)
  }

  @Post('/coffee-create')
  createCoffee(@Body() cafe : Cafe){
    return this.appService.createCoffee(cafe)
  }

}
