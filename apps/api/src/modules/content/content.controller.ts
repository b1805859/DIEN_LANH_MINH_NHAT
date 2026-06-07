import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('services')
  listServices() {
    return this.contentService.listServices();
  }

  @Get('services/:slug')
  getService(@Param('slug') slug: string) {
    return this.contentService.getService(slug);
  }

  @Get('locations')
  listLocations() {
    return this.contentService.listLocations();
  }

  @Get('locations/:slug')
  getLocation(@Param('slug') slug: string) {
    return this.contentService.getLocation(slug);
  }

  @Get('areas/:locationSlug/:serviceSlug')
  getArea(@Param('locationSlug') locationSlug: string, @Param('serviceSlug') serviceSlug: string) {
    return this.contentService.getArea(locationSlug, serviceSlug);
  }

  @Get('categories')
  listCategories() {
    return this.contentService.listCategories();
  }

  @Get('faqs')
  listFaqs() {
    return this.contentService.listFaqs();
  }

  @Get('testimonials')
  listTestimonials() {
    return this.contentService.listTestimonials();
  }

  @Get('blog')
  listBlog(@Query() query: { category?: string; tag?: string; search?: string }) {
    return this.contentService.listBlog(query);
  }

  @Get('blog/:slug')
  getBlogPost(@Param('slug') slug: string) {
    return this.contentService.getBlogPost(slug);
  }
}

