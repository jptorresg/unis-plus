import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;
const CODE_EXPIRY_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { institutionalId: dto.institutionalId }],
      },
      select: {
        email: true,
        institutionalId: true,
      },
    });

    if (existing) {
      const field =
        existing.email === dto.email ? 'correo' : 'ID institucional';

      throw new ConflictException(`El ${field} ya está registrado`);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    let userId: string;

    try {
      const user = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email.toLowerCase(),
          institutionalId: dto.institutionalId,
          categories: [dto.category],
          passwordHash,
          isActive: false,
        },
        select: {
          id: true,
        },
      });

      userId = user.id;
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }

    const code = this.generateVerificationCode();

    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: {
        userId,
        code,
        type: VerificationCodeType.EMAIL_VERIFICATION,
        expiresAt,
      },
    });

    // await this.mail.sendVerificationCode(dto.email, code);
    this.mail.sendVerificationCode(dto.email, code);

    return {
      message:
        'Registro exitoso. Revisa tu correo institucional para verificar tu cuenta.',
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100_000 + Math.random() * 900_000).toString();
  }
}
