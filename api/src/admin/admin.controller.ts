// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    const users = await this.adminService.getAllUsers();
    return users.map((user) => new UserResponseDto(user));
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { success: true };
  }
}
