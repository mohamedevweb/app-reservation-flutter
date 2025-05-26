import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MenuCategory {
    APPETIZER = 'appetizer',
    MAIN_COURSE = 'main_course',
    DESSERT = 'dessert',
    BEVERAGE = 'beverage',
    STARTER = 'starter',
    SOUP = 'soup',
    SALAD = 'salad',
    PIZZA = 'pizza',
    PASTA = 'pasta',
    MEAT = 'meat',
    FISH = 'fish',
    VEGETARIAN = 'vegetarian',
    VEGAN = 'vegan',
}

@Entity('menu_items')
export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: MenuCategory,
    })
    category: MenuCategory;

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    available: boolean;

    @Column({ type: 'text', nullable: true })
    ingredients: string;

    @Column({ type: 'text', nullable: true })
    allergens: string;

    @Column({ default: false, name:'is_vegetarian' })
    isVegetarian: boolean;

    @Column({ default: false, name: 'is_vegan' })
    isVegan: boolean;

    @Column({ default: false, name: 'is_gluten_free' })
    isGlutenFree: boolean;

    @Column({ default: false, name: 'is_spicy' })
    isSpicy: boolean;

    @Column({ type: 'int', default: 0 })
    preparationTime: number; // en minutes

    @Column({ type: 'int', default: 0 })
    calories: number;

    @Column({ default: 0 })
    sortOrder: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}