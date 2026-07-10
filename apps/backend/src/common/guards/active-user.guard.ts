import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as JwtPayload | undefined;

    if (!user) {
      return true;
    }

    const dbUser = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
      select: {
        isActive: true,
        isDeactivated: true,
        deletedAt: true,
      },
    });

    if (
      !dbUser ||
      !dbUser.isActive ||
      dbUser.isDeactivated ||
      dbUser.deletedAt
    ) {
      throw new UnauthorizedException('La sesión ya no es válida');
    }

    return true;
  }
}
