// src/projects/dto/update-project.dto.ts
import {
  IsString,
  IsNumber,
  IsArray,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
