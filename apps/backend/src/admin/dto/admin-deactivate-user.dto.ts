import { IsUUID } from 'class-validator';

export class AdminDeactivateUserDto {
  @IsUUID()
  userId!: string;
}
