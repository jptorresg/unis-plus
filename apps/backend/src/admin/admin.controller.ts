import { Body, Controller, Patch } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { Auth } from '../common/decorators/auth.decorator';
import { AdminService } from './admin.service';
import { AdminDeactivateUserDto } from './dto/admin-deactivate-user.dto';

@Controller('admin')
@Auth({ roles: [UserRole.SYSTEM_ADMIN] })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
