import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  createContactRequest(payload: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
    source?: string;
  }) {
    return this.prisma.contactRequest.create({ data: payload });
  }

  async getSettings() {
    const settings = await this.prisma.setting.findMany();
    return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  }
}

