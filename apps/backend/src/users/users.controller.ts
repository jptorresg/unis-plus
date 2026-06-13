import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('users')
export class UsersController {
  @Get('me')
  getMe(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
