// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProjectResponseDto } from './dto/project-response.dto';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const projects = await this.projectsService.findAll();
    return projects.map((project) => new ProjectResponseDto(project));
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  async findRecommended(@GetUser() user: User) {
    const projects = await this.projectsService.findRecommended(user);
    return projects.map((project) => new ProjectResponseDto(project));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    return new ProjectResponseDto(project);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ENTREPRENEUR)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User,
  ) {
    const project = await this.projectsService.create(createProjectDto, user);
    return new ProjectResponseDto(project);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User,
  ) {
    const project = await this.projectsService.update(
      id,
      updateProjectDto,
      user,
    );
    return new ProjectResponseDto(project);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.projectsService.remove(id, user);
    return { success: true };
  }
}
