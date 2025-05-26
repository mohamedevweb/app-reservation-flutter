// src/investments/dto/investment-response.dto.ts
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

@Exclude()
export class InvestmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  investorId: string;

  @Expose()
  @Type(() => UserResponseDto)
  investor?: UserResponseDto;

  @Expose()
  projectId: string;

  @Expose()
  @Type(() => ProjectResponseDto)
  project?: ProjectResponseDto;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  constructor(partial: Partial<InvestmentResponseDto>) {
    Object.assign(this, partial);
  }
}
