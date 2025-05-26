import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuFilterDto } from './dto/menu-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { MenuCategory } from './entities/menu-item.entity';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    // Endpoints publics (accessibles sans authentification)
    @Get()
    async findAll(@Query() filters: MenuFilterDto) {
        return this.menuService.findAll(filters);
    }

    @Get('categories')
    async getCategories() {
        return this.menuService.getCategories();
    }

    @Get('featured')
    async getFeaturedItems(@Query('limit', ParseIntPipe) limit: number = 6) {
        return this.menuService.getFeaturedItems(limit);
    }

    @Get('search')
    async searchItems(@Query('q') searchTerm: string) {
        if (!searchTerm) {
            return [];
        }
        return this.menuService.searchItems(searchTerm);
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: MenuCategory) {
        return this.menuService.findByCategory(category);
    }

    @Get('stats')
    async getMenuStats() {
        return this.menuService.getMenuStats();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.menuService.findOne(id);
    }

    // Endpoints protégés (nécessitent une authentification admin)
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async create(@Body() createMenuItemDto: CreateMenuItemDto) {
        return this.menuService.create(createMenuItemDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateMenuItemDto: UpdateMenuItemDto,
    ) {
        return this.menuService.update(id, updateMenuItemDto);
    }

    @Patch(':id/toggle-availability')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async toggleAvailability(@Param('id', ParseIntPipe) id: number) {
        return this.menuService.toggleAvailability(id);
    }

    @Patch('sort-order')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateSortOrder(@Body() items: { id: number; sortOrder: number }[]) {
        return this.menuService.updateSortOrder(items);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.menuService.remove(id);
    }
  }