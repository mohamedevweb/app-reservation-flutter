// src/projects/projects.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['owner', 'categories'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'categories', 'investments'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    if (user.role !== UserRole.ENTREPRENEUR) {
      throw new ForbiddenException('Only entrepreneurs can create projects');
    }

    const categories: Interest[] = [];
    if (
      createProjectDto.categoryIds &&
      createProjectDto.categoryIds.length > 0
    ) {
      for (const categoryId of createProjectDto.categoryIds) {
        const category = await this.interestsRepository.findOne({
          where: { id: categoryId },
        });
        if (category) {
          categories.push(category);
        }
      }
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      owner: user,
      ownerId: user.id,
      categories,
    });

    return this.projectsRepository.save(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (project.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own projects');
    }

    // Update categories if provided
    if (updateProjectDto.categoryIds) {
      const categories: Interest[] = [];
      for (const categoryId of updateProjectDto.categoryIds) {
        const category = await this.interestsRepository.findOne({
          where: { id: categoryId },
        });
        if (category) {
          categories.push(category);
        }
      }
      project.categories = categories;
    }

    // Update other fields
    Object.assign(project, updateProjectDto);

    return this.projectsRepository.save(project);
  }

  async remove(id: string, user: User): Promise<void> {
    const project = await this.findOne(id);

    if (project.ownerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You can only delete your own projects or must be an admin',
      );
    }

    await this.projectsRepository.remove(project);
  }

  async findRecommended(user: User): Promise<Project[]> {
    if (!user.interests || user.interests.length === 0) {
      return this.findAll();
    }

    const userInterestIds = user.interests.map((interest) => interest.id);

    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.categories', 'category')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('category.id IN (:...interestIds)', {
        interestIds: userInterestIds,
      })
      .getMany();

    return projects;
  }
}
