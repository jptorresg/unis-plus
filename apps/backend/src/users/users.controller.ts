import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { UsersService } from './users.service';
import type { UserProfileDto } from './dto/user-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: unknown): Promise<UserProfileDto> {
    const payload = user as JwtPayload;
    return this.usersService.getMe(payload.sub);
  }
}
