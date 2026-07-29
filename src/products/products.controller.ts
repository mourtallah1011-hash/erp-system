import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@CurrentUser('companyId') companyId: string) {
    return this.productsService.findAll(companyId);
  }

  @Get('low-stock')
  lowStock(@CurrentUser('companyId') companyId: string) {
    return this.productsService.lowStock(companyId);
  }

  @Get(':id')
  findOne(@CurrentUser('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.findOne(companyId, id);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STOCK_KEEPER')
  @Post()
  create(@CurrentUser('companyId') companyId: string, @Body() dto: CreateProductDto) {
    return this.productsService.create(companyId, dto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STOCK_KEEPER')
  @Patch(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(companyId, id, dto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  @Delete(':id')
  remove(@CurrentUser('companyId') companyId: string, @Param('id') id: string) {
    return this.productsService.remove(companyId, id);
  }
}
