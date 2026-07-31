// src/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const s = await this.prisma.setting.findFirst();
    return s;
  }

  async update(data: any) {
    const s = await this.prisma.setting.findFirst();
    if (!s) return this.prisma.setting.create({ data });
    return this.prisma.setting.update({ where: { id: s.id }, data });
  }
}
