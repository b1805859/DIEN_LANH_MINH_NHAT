import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PUBLIC_SETTING_KEYS = new Set(['business']);

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      where: { key: { in: [...PUBLIC_SETTING_KEYS] } },
    });

    return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  }
}
