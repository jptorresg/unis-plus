import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import type { UploadedMulterFile } from '../common/pipes/file-validation.pipe';

import type { ChangePasswordDto } from './dto/change-password.dto';
import type { DeactivateAccountDto } from './dto/deactivate-account.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';
import type { UserProfileDto } from './dto/user-profile.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getMe(userId: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        institutionalId: true,
        email: true,
        firstName: true,
        lastName: true,
        description: true,
        avatarUrl: true,
        bannerUrl: true,
        role: true,
        categories: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.bannerUrl !== undefined && { bannerUrl: dto.bannerUrl }),
      },
    });

    return this.getMe(userId);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    const newHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async deactivateMe(
    userId: string,
    dto: DeactivateAccountDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isDeactivated: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isDeactivated) {
      throw new BadRequestException('La cuenta ya está desactivada');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
        keepContentOnDelete: dto.keepContent,
        deletedAt: new Date(),
      },
    });

    return { message: 'Cuenta desactivada correctamente' };
  }

  async uploadProfileImage(
    userId: string,
    file: UploadedMulterFile,
    type: 'avatar' | 'banner',
  ): Promise<{ url: string; publicId: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const folder = `unis-plus/users/${type}s`;

    const result = await this.cloudinary.uploadFile(file.buffer, folder, {
      transformation:
        type === 'avatar'
          ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
          : [{ width: 1200, height: 400, crop: 'fill' }],
    });

    return {
      url: result.url,
      publicId: result.publicId,
    };
  }
}
