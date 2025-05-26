import { IsOptional, IsEnum, IsBoolean, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { MenuCategory } from '../entities/menu-item.entity';

export class MenuFilterDto {
    @IsOptional()
    @IsEnum(MenuCategory)
    category?: MenuCategory;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    available?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isVegetarian?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isVegan?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isGlutenFree?: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isSpicy?: boolean;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    sortBy?: string = 'sortOrder';

    @IsOptional()
    @IsString()
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}