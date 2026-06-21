import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { UserProfileDto } from './dto/user-profile.dto';
import { DeactivateAccountDto } from './dto/deactivate-account.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: unknown): Promise<UserProfileDto> {
    const payload = user as JwtPayload;
    return this.usersService.getMe(payload.sub);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() user: unknown,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const payload = user as JwtPayload;
    return this.usersService.updateProfile(payload.sub, dto);
  }

  @Post('me/change-password')
  async changePassword(
    @CurrentUser() user: unknown,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const payload = user as JwtPayload;
    return this.usersService.changePassword(payload.sub, dto);
  }

  @Post('me/deactivate')
  async deactivateMe(
    @CurrentUser() user: unknown,
    @Body() dto: DeactivateAccountDto,
  ): Promise<{ message: string }> {
    const payload = user as JwtPayload;
    return this.usersService.deactivateMe(payload.sub, dto);
  }
}
