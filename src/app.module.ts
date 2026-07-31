// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SettingsModule } from './settings/settings.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UsersModule, ProductsModule, SalesModule, SettingsModule],
  providers: [PrismaService],
})
export class AppModule {}
