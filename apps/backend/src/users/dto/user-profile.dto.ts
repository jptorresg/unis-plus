import type { InstitutionalCategory, UserRole } from '@prisma/client';

export class UserProfileDto {
  id!: string;
  institutionalId!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  description!: string | null;
  avatarUrl!: string | null;
  bannerUrl!: string | null;
  role!: UserRole;
  categories!: InstitutionalCategory[];
  createdAt!: Date;
}
