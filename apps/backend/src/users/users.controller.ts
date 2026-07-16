import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileValidationPipe,
  type UploadedMulterFile,
} from '../common/pipes/file-validation.pipe';

import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { ChangePasswordDto } from './dto/change-password.dto';
import { DeactivateAccountDto } from './dto/deactivate-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { UserProfileDto } from './dto/user-profile.dto';
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

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: unknown,
    @UploadedFile(new FileValidationPipe()) file: UploadedMulterFile,
  ) {
    const { sub } = user as JwtPayload;
    const { url, publicId } = await this.usersService.uploadProfileImage(
      sub,
      file,
      'avatar',
    );
    await this.usersService.updateProfile(sub, { avatarUrl: url });
    return { url, publicId };
  }

  @Post('me/banner')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBanner(
    @CurrentUser() user: unknown,
    @UploadedFile(new FileValidationPipe()) file: UploadedMulterFile,
  ) {
    const { sub } = user as JwtPayload;
    const { url, publicId } = await this.usersService.uploadProfileImage(
      sub,
      file,
      'banner',
    );
    await this.usersService.updateProfile(sub, { bannerUrl: url });
    return { url, publicId };
  }
}
