// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Connecter un utilisateur' }) // Décommenter après installation
  @ApiBody({ type: LoginDto }) // Décommenter après installation
  @ApiResponse({ status: 200, description: 'Utilisateur connecté avec succès' }) // Décommenter après installation
  @ApiResponse({ status: 401, description: 'Identifiants invalides' }) // Décommenter après installation
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un nouvel utilisateur' }) // Décommenter après installation
  @ApiBody({ type: CreateUserDto }) // Décommenter après installation
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  }) // Décommenter après installation
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' }) // Décommenter après installation
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user);
  }
}
