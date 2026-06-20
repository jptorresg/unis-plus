import {
  BadRequestException,
  GoneException,
  HttpException,
  HttpStatus,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { VerificationCodeType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { TypedConfigService } from '../config/typed-config.service';
import type {
  JwtPayload,
  JwtRefreshPayload,
  ValidatedUser,
} from './types/jwt-payload.type';
import * as bcrypt from 'bcrypt';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;
const CODE_EXPIRY_MINUTES = 15;

const MAX_VERIFICATION_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 120;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
    private readonly config: TypedConfigService,
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

  private isCodeValid(stored: string, received: string): boolean {
    const a = Buffer.from(stored.padEnd(6, '\0'));
    const b = Buffer.from(received.padEnd(6, '\0'));

    return a.length === b.length && timingSafeEqual(a, b);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const record = await this.prisma.verificationCode.findFirst({
      where: {
        user: { email: dto.email.toLowerCase() },
        type: VerificationCodeType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        attempts: true,
        userId: true,
      },
    });

    if (!record) {
      throw new NotFoundException(
        'No hay un código de verificación pendiente para este correo',
      );
    }

    if (record.expiresAt < new Date()) {
      throw new GoneException('El código ha expirado. Solicita uno nuevo.');
    }

    if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new HttpException(
        'Demasiados intentos fallidos. Solicita un nuevo código.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.prisma.verificationCode.update({
      where: { id: record.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    if (!this.isCodeValid(record.code, dto.code)) {
      throw new BadRequestException('Código incorrecto');
    }

    await this.prisma.$transaction([
      this.prisma.verificationCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),

      this.prisma.user.update({
        where: { id: record.userId },
        data: { isActive: true },
      }),
    ]);

    return {
      message: 'Correo verificado correctamente. Ya puedes iniciar sesión.',
    };
  }

  async resendVerification(
    dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        isActive: false,
        deletedAt: null,
      },
      select: { id: true },
    });

    // Respuesta genérica: no revelar si el email existe (anti-enumeración)
    if (!user) {
      return {
        message:
          'Si el correo está registrado y pendiente de verificación, recibirás un nuevo código.',
      };
    }

    // Verificar cooldown: ¿se envió un código hace menos de 2 minutos?
    const recentCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        type: VerificationCodeType.EMAIL_VERIFICATION,
        usedAt: null,
        createdAt: {
          gte: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000),
        },
      },
      select: { id: true, createdAt: true },
    });

    if (recentCode) {
      const secondsLeft = Math.ceil(
        (recentCode.createdAt.getTime() +
          RESEND_COOLDOWN_SECONDS * 1000 -
          Date.now()) /
          1000,
      );
      throw new HttpException(
        `Espera ${secondsLeft} segundos antes de solicitar un nuevo código.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Invalidar todos los códigos pendientes anteriores
    await this.prisma.verificationCode.updateMany({
      where: {
        userId: user.id,
        type: VerificationCodeType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    // Crear nuevo código
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: VerificationCodeType.EMAIL_VERIFICATION,
        expiresAt,
      },
    });

    this.mail.sendVerificationCode(dto.email, code);

    return {
      message:
        'Si el correo está registrado y pendiente de verificación, recibirás un nuevo código.',
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        role: true,
        categories: true,
        passwordHash: true,
        isActive: true,
        isDeactivated: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || user.isDeactivated) return null;
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Cuenta no verificada. Revisa tu correo.',
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      categories: user.categories,
    };
  }

  login(user: ValidatedUser): { accessToken: string; refreshToken: string } {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      categories: user.categories,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      tokenId: user.id,
    };

    const accessToken = this.jwt.sign(accessPayload);

    const refreshToken = this.jwt.sign(refreshPayload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    payload: JwtRefreshPayload,
  ): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        categories: true,
        isActive: true,
        isDeactivated: true,
        deletedAt: true,
      },
    });

    if (!user || !user.isActive || user.isDeactivated || user.deletedAt) {
      throw new UnauthorizedException('Sesión inválida');
    }

    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      categories: user.categories,
    };

    return { accessToken: this.jwt.sign(accessPayload) };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const GENERIC_RESPONSE = {
      message:
        'Si el correo está registrado y activo, recibirás un enlace de recuperación.',
    };

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        isActive: true,
        isDeactivated: false,
        deletedAt: null,
      },
      select: { id: true },
    });

    // Respuesta genérica — no revelar si el email existe
    if (!user) return GENERIC_RESPONSE;

    // Cooldown: mismo mecanismo que resendVerification
    const recentCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        type: VerificationCodeType.PASSWORD_RESET,
        usedAt: null,
        createdAt: {
          gte: new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000),
        },
      },
      select: { id: true, createdAt: true },
    });

    if (recentCode) {
      const secondsLeft = Math.ceil(
        (recentCode.createdAt.getTime() +
          RESEND_COOLDOWN_SECONDS * 1000 -
          Date.now()) /
          1000,
      );
      throw new HttpException(
        `Espera ${secondsLeft} segundos antes de solicitar otro código.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Invalidar códigos PASSWORD_RESET anteriores no usados
    await this.prisma.verificationCode.updateMany({
      where: {
        userId: user.id,
        type: VerificationCodeType.PASSWORD_RESET,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: VerificationCodeType.PASSWORD_RESET,
        expiresAt,
      },
    });

    this.mail.sendPasswordResetCode(dto.email, code);

    return GENERIC_RESPONSE;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const record = await this.prisma.verificationCode.findFirst({
      where: {
        user: { email: dto.email.toLowerCase() },
        type: VerificationCodeType.PASSWORD_RESET,
        usedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        attempts: true,
        userId: true,
      },
    });

    if (!record) {
      throw new NotFoundException(
        'No hay un código de recuperación pendiente para este correo',
      );
    }

    if (record.expiresAt < new Date()) {
      throw new GoneException('El código ha expirado. Solicita uno nuevo.');
    }

    if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new HttpException(
        'Demasiados intentos fallidos. Solicita un nuevo código.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Incrementar intentos antes de comparar
    await this.prisma.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    if (!this.isCodeValid(record.code, dto.code)) {
      throw new BadRequestException('Código incorrecto');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    // Marcar código y actualizar contraseña en una transacción
    await this.prisma.$transaction([
      this.prisma.verificationCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
    ]);

    return {
      message:
        'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
    };
  }
}
