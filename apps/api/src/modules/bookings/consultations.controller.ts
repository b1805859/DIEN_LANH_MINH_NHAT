import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PrismaService } from '../../prisma/prisma.service';

class CreateConsultationDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customerName!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.replace(/[\s.-]/g, '') : value)
  @Matches(/^(?:0|\+?84)(?:[35789]\d{8}|2\d{9})$/)
  customerPhone!: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  notes?: string;
}

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateConsultationDto) {
    return this.prisma.consultationRequest.create({
      data: { customerName: dto.customerName, customerPhone: dto.customerPhone, notes: dto.notes ?? '' },
      select: { id: true },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @Get()
  listPending() {
    return this.prisma.consultationRequest.findMany({
      where: { contactedAt: null },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: 100,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'STAFF')
  @Patch(':id/contacted')
  async markContacted(@Param('id') id: string) {
    await this.prisma.consultationRequest.updateMany({
      where: { id, contactedAt: null },
      data: { contactedAt: new Date() },
    });
    return { success: true };
  }
}
