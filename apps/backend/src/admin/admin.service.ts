import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { AdminDeactivateUserDto } from './dto/admin-deactivate-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async deactivateUser(
    dto: AdminDeactivateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, isDeactivated: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isDeactivated) {
      throw new BadRequestException('El usuario ya está desactivado');
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
        deletedAt: new Date(),
      },
    });

    return { message: 'Usuario desactivado correctamente' };
  }

  async reactivateUser(
    dto: AdminDeactivateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { id: true, isDeactivated: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.isDeactivated) {
      throw new BadRequestException('El usuario no está desactivado');
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        isDeactivated: false,
        deactivatedAt: null,
        deletedAt: null,
      },
    });

    return { message: 'Usuario reactivado correctamente' };
  }
}
