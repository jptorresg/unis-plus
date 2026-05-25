import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @Matches(/@unis\.edu\.gt$/i, {
    message: 'El correo debe ser institucional (@unis.edu.gt)',
  })
  email!: string;

  @IsString()
  @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
  @Matches(/^\d{6}$/, { message: 'El código debe ser numérico' })
  code!: string;
}
