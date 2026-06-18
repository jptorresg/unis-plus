import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  //async sendVerificationCode(email: string, code: string): Promise<void>
  sendVerificationCode(email: string, code: string): void {
    // TODO Sprint 3 Paso 2: implementar con Nodemailer + SMTP real
    this.logger.log(`[STUB] Código de verificación para ${email}: ${code}`);
  }

  sendPasswordResetCode(email: string, code: string): void {
    // TODO Sprint 3 Paso 5: implementar con Nodemailer + SMTP real
    this.logger.log(`[STUB] Código de recuperación para ${email}: ${code}`);
  }
}
