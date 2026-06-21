import { IsBoolean } from 'class-validator';

export class DeactivateAccountDto {
  @IsBoolean()
  keepContent!: boolean;
}
