// src/investments/investments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { InvestmentResponseDto } from './dto/investment-response.dto';

@Controller('investments')
@UseInterceptors(ClassSerializerInterceptor)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User) {
    // For investors: return their investments
    if (user.role === UserRole.INVESTOR) {
      const investments = await this.investmentsService.findByUser(user.id);
      return investments.map(
        (investment) => new InvestmentResponseDto(investment),
      );
    }

    // For admins: return all investments
    if (user.role === UserRole.ADMIN) {
      const investments = await this.investmentsService.findAll();
      return investments.map(
        (investment) => new InvestmentResponseDto(investment),
      );
    }

    // For entrepreneurs: only return investments on their projects
    // This would require an additional service method to fetch by entrepreneur's projects
    return [];
  }

  @Get('project/:id')
  @UseGuards(JwtAuthGuard)
  async findByProject(@Param('id') projectId: string, @GetUser() user: User) {
    // Should verify the user has rights to see these investments (owner or admin)
    const investments = await this.investmentsService.findByProject(projectId);
    return investments.map(
      (investment) => new InvestmentResponseDto(investment),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INVESTOR)
  async create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @GetUser() user: User,
  ) {
    const investment = await this.investmentsService.create(
      createInvestmentDto,
      user,
    );
    return new InvestmentResponseDto(investment);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.investmentsService.remove(id, user);
    return { success: true };
  }
}
