// src/sales/sales.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async createSale(data: { userId?: number; items: { productId?: number; sku?: string; quantity: number }[] }) {
    const prisma = this.prisma;
    return await prisma.$transaction(async (tx) => {
      // compute total and validate stock
      let total = 0;
      const sale = await tx.sale.create({ data: { userId: data.userId || null, total: 0 } });

      for (const it of data.items) {
        let product = null;
        if (it.productId) product = await tx.product.findUnique({ where: { id: it.productId } });
        else if (it.sku) product = await tx.product.findUnique({ where: { sku: it.sku } });
        if (!product) throw new BadRequestException('Product not found');
        if (product.stock < it.quantity) throw new BadRequestException(`Not enough stock for ${product.name}`);

        await tx.saleItem.create({ data: { saleId: sale.id, productId: product.id, quantity: it.quantity, price: product.price } });
        await tx.product.update({ where: { id: product.id }, data: { stock: product.stock - it.quantity } });
        total += product.price * it.quantity;
      }

      await tx.sale.update({ where: { id: sale.id }, data: { total } });
      return await tx.sale.findUnique({ where: { id: sale.id }, include: { items: true, user: true } });
    });
  }

  findAll() {
    return this.prisma.sale.findMany({ include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: 'desc' } });
  }
}
