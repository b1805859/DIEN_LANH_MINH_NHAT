import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { PublicService } from './public.service';

class ContactRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(8)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  source?: string;
}

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('contact-requests')
  createContactRequest(@Body() dto: ContactRequestDto) {
    return this.publicService.createContactRequest(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('quotation-requests')
  createQuotationRequest(@Body() dto: ContactRequestDto) {
    return this.publicService.createContactRequest({ ...dto, source: dto.source ?? 'quotation' });
  }

  @Get('settings')
  getSettings() {
    return this.publicService.getSettings();
  }
}

