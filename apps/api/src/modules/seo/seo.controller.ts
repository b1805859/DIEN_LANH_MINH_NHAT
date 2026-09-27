import { Controller, Get } from '@nestjs/common';
import { SeoService } from './seo.service';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap')
  getSitemapEntries() {
    return this.seoService.getSitemapEntries();
  }
}
