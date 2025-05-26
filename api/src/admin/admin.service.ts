// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['interests'],
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.usersRepository.remove(user);
  }

  async getAllInvestments(): Promise<Investment[]> {
    return this.investmentsRepository.find({
      relations: ['investor', 'project'],
    });
  }
}
