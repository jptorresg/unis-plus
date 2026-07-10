import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { InstitutionalCategory, Prisma, UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import type { AdminDeactivateUserDto } from './dto/admin-deactivate-user.dto';
import type { AdminUserListDto } from './dto/admin-user-list.dto';

export interface AdminUserEntry {
  id: string;
  institutionalId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  categories: InstitutionalCategory[];
  isActive: boolean;
  isDeactivated: boolean;
  deactivatedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
}

export interface AdminUserListResult {
  data: AdminUserEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

  async listUsers(dto: AdminUserListDto): Promise<AdminUserListResult> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(dto.search && {
        OR: [
          { firstName: { contains: dto.search, mode: 'insensitive' } },
          { lastName: { contains: dto.search, mode: 'insensitive' } },
          { email: { contains: dto.search, mode: 'insensitive' } },
          { institutionalId: { contains: dto.search, mode: 'insensitive' } },
        ],
      }),
      ...(dto.role !== undefined && { role: dto.role }),
      ...(dto.isDeactivated !== undefined && {
        isDeactivated: dto.isDeactivated,
      }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          institutionalId: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          categories: true,
          isActive: true,
          isDeactivated: true,
          deactivatedAt: true,
          deletedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
