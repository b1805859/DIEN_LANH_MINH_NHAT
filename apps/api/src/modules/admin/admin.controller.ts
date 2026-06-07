import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get(':resource')
  list(@Param('resource') resource: string, @Query() query: Record<string, string | undefined>) {
    return this.adminService.list(resource, query);
  }

  @Get(':resource/:id')
  get(@Param('resource') resource: string, @Param('id') id: string) {
    return this.adminService.get(resource, id);
  }

  @Post(':resource')
  create(@Param('resource') resource: string, @Body() payload: Record<string, unknown>) {
    return this.adminService.create(resource, payload);
  }

  @Patch(':resource/:id')
  update(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.update(resource, id, payload);
  }

  @Delete(':resource/:id')
  remove(@Param('resource') resource: string, @Param('id') id: string) {
    return this.adminService.remove(resource, id);
  }
}

