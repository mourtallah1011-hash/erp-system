import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const product = await this.prisma.product.findFirst({ where: { id, companyId } });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  async create(companyId: string, dto: CreateProductDto) {
    const existing = await this.prisma.product.findFirst({
      where: { companyId, sku: dto.sku },
    });
    if (existing) throw new ConflictException('Ce SKU existe déjà pour cette entreprise');

    return this.prisma.product.create({
      data: {
        companyId,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        unitPrice: dto.unitPrice,
        costPrice: dto.costPrice,
        quantity: dto.quantity ?? 0,
        minStock: dto.minStock ?? 0,
        unit: dto.unit ?? 'pcs',
      },
    });
  }

  async update(companyId: string, id: string, dto: UpdateProductDto) {
    await this.findOne(companyId, id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async lowStock(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId, isActive: true },
    });
    return products.filter((p) => p.quantity <= p.minStock);
  }
}