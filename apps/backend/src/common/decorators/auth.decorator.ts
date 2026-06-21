import { applyDecorators } from '@nestjs/common';
import type { InstitutionalCategory, UserRole } from '@prisma/client';

import { Categories } from './categories.decorator';
import { Roles } from './roles.decorator';

export interface AuthOptions {
  roles?: UserRole[];
  categories?: InstitutionalCategory[];
}

export const Auth = (options: AuthOptions = {}) => {
  const decorators = [];

  if (options.roles && options.roles.length > 0) {
    decorators.push(Roles(...options.roles));
  }

  if (options.categories && options.categories.length > 0) {
    decorators.push(Categories(...options.categories));
  }

  return applyDecorators(...decorators);
};
