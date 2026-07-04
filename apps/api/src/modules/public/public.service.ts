import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PUBLIC_SETTING_KEYS = new Set(['business']);

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async createContactRequest(payload: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
    source?: string;
  }) {
    const request = await this.prisma.contactRequest.create({
      data: payload,
      select: { id: true, createdAt: true },
    });

    return { success: true, id: request.id, createdAt: request.createdAt };
  }

  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { key: { in: [...PUBLIC_SETTING_KEYS] } },
    });

    return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  }
}
