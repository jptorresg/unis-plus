import type { InstitutionalCategory, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  categories: InstitutionalCategory[];
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string;
  tokenId: string;
}

export interface ValidatedUser {
  id: string;
  email: string;
  role: UserRole;
  categories: InstitutionalCategory[];
}
