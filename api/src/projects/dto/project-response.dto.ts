// src/projects/dto/project-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

@Exclude()
export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  budget: number;

  @Expose()
  ownerId: string;

  @Expose()
  @Type(() => UserResponseDto)
  owner?: UserResponseDto;

  @Expose()
  categories: any[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ProjectResponseDto>) {
    Object.assign(this, partial);
  }
}
