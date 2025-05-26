import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { MenuCategory } from '../entities/menu-item.entity';

export class CreateMenuItemDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsEnum(MenuCategory)
    category: MenuCategory;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    available?: boolean;

    @IsOptional()
    @IsString()
    ingredients?: string;

    @IsOptional()
    @IsString()
    allergens?: string;

    @IsOptional()
    @IsBoolean()
    isVegetarian?: boolean;

    @IsOptional()
    @IsBoolean()
    isVegan?: boolean;

    @IsOptional()
    @IsBoolean()
    isGlutenFree?: boolean;

    @IsOptional()
    @IsBoolean()
    isSpicy?: boolean;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(300)
    preparationTime?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    calories?: number;

    @IsOptional()
    @IsNumber()
    sortOrder?: number;
}