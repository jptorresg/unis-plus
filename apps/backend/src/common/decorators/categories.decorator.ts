import { SetMetadata } from '@nestjs/common';
import type { InstitutionalCategory } from '@prisma/client';

export const CATEGORIES_KEY = 'categories';

export const Categories = (...categories: InstitutionalCategory[]) =>
  SetMetadata(CATEGORIES_KEY, categories);
