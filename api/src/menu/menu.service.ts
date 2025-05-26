import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { MenuItem, MenuCategory } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuFilterDto } from './dto/menu-filter.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuItem)
        private menuItemRepository: Repository<MenuItem>,
    ) { }

    async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
        // Vérifier si un item avec le même nom existe déjà
        const existingItem = await this.menuItemRepository.findOne({
            where: { name: createMenuItemDto.name },
        });

        if (existingItem) {
            throw new ConflictException('Menu item with this name already exists');
        }

        const menuItem = this.menuItemRepository.create(createMenuItemDto);
        return await this.menuItemRepository.save(menuItem);
    }

    async findAll(filters?: MenuFilterDto): Promise<{
        items: MenuItem[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const {
            category,
            available,
            isVegetarian,
            isVegan,
            isGlutenFree,
            isSpicy,
            search,
            minPrice,
            maxPrice,
            page = 1,
            limit = 20,
            sortBy = 'sortOrder',
            sortOrder = 'ASC',
        } = filters || {};

        const query = this.menuItemRepository.createQueryBuilder('menuItem');

        // Filtres
        if (category) {
            query.andWhere('menuItem.category = :category', { category });
        }

        if (available !== undefined) {
            query.andWhere('menuItem.available = :available', { available });
        }

        if (isVegetarian !== undefined) {
            query.andWhere('menuItem.isVegetarian = :isVegetarian', { isVegetarian });
        }

        if (isVegan !== undefined) {
            query.andWhere('menuItem.isVegan = :isVegan', { isVegan });
        }

        if (isGlutenFree !== undefined) {
            query.andWhere('menuItem.isGlutenFree = :isGlutenFree', { isGlutenFree });
        }

        if (isSpicy !== undefined) {
            query.andWhere('menuItem.isSpicy = :isSpicy', { isSpicy });
        }

        if (search) {
            query.andWhere(
                '(menuItem.name LIKE :search OR menuItem.description LIKE :search OR menuItem.ingredients LIKE :search)',
                { search: `%${search}%` },
            );
        }

        if (minPrice !== undefined) {
            query.andWhere('menuItem.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            query.andWhere('menuItem.price <= :maxPrice', { maxPrice });
        }

        // Tri
        const validSortFields = ['name', 'price', 'category', 'sortOrder', 'createdAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'sortOrder';
        query.orderBy(`menuItem.${sortField}`, sortOrder);

        // Pagination
        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const [items, total] = await query.getManyAndCount();
        const totalPages = Math.ceil(total / limit);

        return {
            items,
            total,
            page,
            totalPages,
        };
    }

    async findOne(id: number): Promise<MenuItem> {
        const menuItem = await this.menuItemRepository.findOne({
            where: { id },
        });

        if (!menuItem) {
            throw new NotFoundException(`Menu item with ID ${id} not found`);
        }

        return menuItem;
    }

    async findByCategory(category: MenuCategory): Promise<MenuItem[]> {
        return await this.menuItemRepository.find({
            where: { category, available: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    async getCategories(): Promise<{ category: string; count: number }[]> {
        const result = await this.menuItemRepository
            .createQueryBuilder('menuItem')
            .select('menuItem.category', 'category')
            .addSelect('COUNT(*)', 'count')
            .where('menuItem.available = :available', { available: true })
            .groupBy('menuItem.category')
            .getRawMany();

        return result.map(item => ({
            category: item.category,
            count: parseInt(item.count),
        }));
    }

    async getFeaturedItems(limit: number = 6): Promise<MenuItem[]> {
        return await this.menuItemRepository.find({
            where: { available: true },
            order: { sortOrder: 'ASC', createdAt: 'DESC' },
            take: limit,
        });
    }

    async searchItems(searchTerm: string): Promise<MenuItem[]> {
        return await this.menuItemRepository
            .createQueryBuilder('menuItem')
            .where('menuItem.available = :available', { available: true })
            .andWhere(
                '(menuItem.name LIKE :search OR menuItem.description LIKE :search OR menuItem.ingredients LIKE :search)',
                { search: `%${searchTerm}%` },
            )
            .orderBy('menuItem.sortOrder', 'ASC')
            .getMany();
    }

    async update(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
        const menuItem = await this.findOne(id);

        // Vérifier si le nouveau nom existe déjà (si le nom est modifié)
        if (updateMenuItemDto.name && updateMenuItemDto.name !== menuItem.name) {
            const existingItem = await this.menuItemRepository.findOne({
                where: { name: updateMenuItemDto.name },
            });

            if (existingItem) {
                throw new ConflictException('Menu item with this name already exists');
            }
        }

        Object.assign(menuItem, updateMenuItemDto);
        return await this.menuItemRepository.save(menuItem);
    }

    async remove(id: number): Promise<void> {
        const menuItem = await this.findOne(id);
        await this.menuItemRepository.remove(menuItem);
    }

    async toggleAvailability(id: number): Promise<MenuItem> {
        const menuItem = await this.findOne(id);
        menuItem.available = !menuItem.available;
        return await this.menuItemRepository.save(menuItem);
    }

    async updateSortOrder(items: { id: number; sortOrder: number }[]): Promise<void> {
        const promises = items.map(item =>
            this.menuItemRepository.update(item.id, { sortOrder: item.sortOrder }),
        );
        await Promise.all(promises);
    }

    async getMenuStats(): Promise<{
        totalItems: number;
        availableItems: number;
        categoriesCount: number;
        averagePrice: number;
    }> {
        const totalItems = await this.menuItemRepository.count();
        const availableItems = await this.menuItemRepository.count({
            where: { available: true },
        });

        const categories = await this.menuItemRepository
            .createQueryBuilder('menuItem')
            .select('DISTINCT menuItem.category')
            .getRawMany();

        const avgPriceResult = await this.menuItemRepository
            .createQueryBuilder('menuItem')
            .select('AVG(menuItem.price)', 'avg')
            .where('menuItem.available = :available', { available: true })
            .getRawOne();

        return {
            totalItems,
            availableItems,
            categoriesCount: categories.length,
            averagePrice: parseFloat(avgPriceResult.avg) || 0,
        };
    }
}