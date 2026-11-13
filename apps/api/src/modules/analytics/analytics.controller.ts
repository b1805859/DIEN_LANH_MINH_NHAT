import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AnalyticsService } from './analytics.service';

export class PageViewDto {
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  path!: string;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('page-view')
  @HttpCode(204)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async pageView(@Body() body: PageViewDto) {
    await this.analytics.recordPageView(body.path);
  }
}
