import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { Auth } from '../common/decorators/auth.decorator';

import { AdminService } from './admin.service';
import type { AdminUserListResult } from './admin.service';
import { AdminDeactivateUserDto } from './dto/admin-deactivate-user.dto';
import { AdminUserListDto } from './dto/admin-user-list.dto';

@Controller('admin')
@Auth({ roles: [UserRole.SYSTEM_ADMIN] })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async listUsers(
    @Query() dto: AdminUserListDto,
  ): Promise<AdminUserListResult> {
    return this.adminService.listUsers(dto);
  }

  @Patch('users/deactivate')
  async deactivateUser(
    @Body() dto: AdminDeactivateUserDto,
  ): Promise<{ message: string }> {
    return this.adminService.deactivateUser(dto);
  }

  @Patch('users/reactivate')
  async reactivateUser(
    @Body() dto: AdminDeactivateUserDto,
  ): Promise<{ message: string }> {
    return this.adminService.reactivateUser(dto);
  }
}
