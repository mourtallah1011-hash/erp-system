// src/settings/settings.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get() {
    return this.settingsService.get();
  }

  @Put()
  update(@Body() body: any) {
    return this.settingsService.update(body);
  }
}
