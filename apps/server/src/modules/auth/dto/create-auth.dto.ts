import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString({ always: true })
  phone!: string;

  @IsString()
  password!: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
