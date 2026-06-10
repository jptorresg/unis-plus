import type { InstitutionalCategory } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @IsEmail()
  @Matches(/@unis\.edu\.gt$/i, {
    message: 'El correo debe ser institucional (@unis.edu.gt)',
  })
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  institutionalId!: string;

  @IsEnum(['STUDENT', 'TEACHER', 'STAFF', 'ALUMNI'])
  category!: InstitutionalCategory;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
