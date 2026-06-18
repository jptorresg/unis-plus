import { IsEmail, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @Matches(/@unis\.edu\.gt$/i, {
    message: 'El correo debe ser institucional (@unis.edu.gt)',
  })
  email!: string;
}
