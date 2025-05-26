// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email unique',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe (minimum 6 caractères)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', required: false, description: 'Prénom' })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiProperty({
    example: 'Doe',
    required: false,
    description: 'Nom de famille',
  })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.ENTREPRENEUR,
    required: false,
    description: "Rôle de l'utilisateur (entrepreneur, investor, admin)",
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
