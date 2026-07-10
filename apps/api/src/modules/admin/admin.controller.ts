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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequestUser } from '../../common/types/request-user';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: RequestUser) {
    return this.adminService.getDashboard(user.role);
  }

  @Get('history')
  history(@CurrentUser() user: RequestUser, @Query() query: Record<string, string | undefined>) {
    return this.adminService.listHistory(query, user.role);
  }

  @Post('history/:id/revert')
  revertHistory(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.adminService.revertHistory(id, user);
  }

  @Get(':resource')
  list(
    @CurrentUser() user: RequestUser,
    @Param('resource') resource: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    return this.adminService.list(resource, query, user.role);
  }

  @Get(':resource/:id')
  get(@CurrentUser() user: RequestUser, @Param('resource') resource: string, @Param('id') id: string) {
    return this.adminService.get(resource, id, user.role);
  }

  @Post(':resource')
  create(
    @CurrentUser() user: RequestUser,
    @Param('resource') resource: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.create(resource, payload, user.role);
  }

  @Patch(':resource/:id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.adminService.update(resource, id, payload, user);
  }

  @Delete(':resource/:id')
  remove(@CurrentUser() user: RequestUser, @Param('resource') resource: string, @Param('id') id: string) {
    return this.adminService.remove(resource, id, user);
  }
}
