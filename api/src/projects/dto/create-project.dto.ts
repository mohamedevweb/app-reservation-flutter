// src/projects/dto/create-project.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
