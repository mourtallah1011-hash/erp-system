// src/sales/sales.controller.ts
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() body: any) {
    return this.salesService.createSale(body);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
