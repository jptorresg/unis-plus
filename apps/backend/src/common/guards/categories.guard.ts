import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { InstitutionalCategory } from '@prisma/client';
import type { Request } from 'express';

import type { JwtPayload } from '../../auth/types/jwt-payload.type';
import { CATEGORIES_KEY } from '../decorators/categories.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class CategoriesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredCategories = this.reflector.getAllAndOverride<
      InstitutionalCategory[]
    >(CATEGORIES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredCategories || requiredCategories.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload | undefined;
    if (!user) return true;

    const userCategories = user.categories ?? [];
    const hasCategory = requiredCategories.some((cat) =>
      userCategories.includes(cat),
    );

    if (!hasCategory) {
      throw new ForbiddenException(
        'No tienes la categoría institucional requerida',
      );
    }

    return true;
  }
}
