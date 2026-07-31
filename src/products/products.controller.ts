// src/products/products.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
