// src/investments/investments.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['investor', 'project'],
    });
  }

  async findByUser(userId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { investorId: userId },
      relations: ['project'],
    });
  }

  async findByProject(projectId: string): Promise<Investment[]> {
    return this.investmentsRepository.find({
      where: { projectId },
      relations: ['investor'],
    });
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['investor', 'project'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID "${id}" not found`);
    }

    return investment;
  }

  async create(
    createInvestmentDto: CreateInvestmentDto,
    user: User,
  ): Promise<Investment> {
    // if (user.role !== UserRole.INVESTOR) {
    //   throw new ForbiddenException('Only investors can make investments');
    // }

    // Verify project exists
    const project = await this.projectsRepository.findOne({
      where: { id: createInvestmentDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID "${createInvestmentDto.projectId}" not found`,
      );
    }

    const investment = this.investmentsRepository.create({
      ...createInvestmentDto,
      investor: user,
      investorId: user.id,
      project,
    });

    return this.investmentsRepository.save(investment);
  }

  async remove(id: string, user: User): Promise<void> {
    const investment = await this.findOne(id);

    if (investment.investorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You can only cancel your own investments or must be an admin',
      );
    }

    await this.investmentsRepository.remove(investment);
  }
}
