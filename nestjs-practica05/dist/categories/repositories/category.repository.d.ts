import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
export declare class CategoryRepository {
    private readonly repository;
    constructor(repository: Repository<CategoryEntity>);
    findAll(): Promise<CategoryEntity[]>;
    findById(id: number): Promise<CategoryEntity | null>;
    existsByName(name: string): Promise<boolean>;
    countProducts(categoryId: number): Promise<number>;
    save(category: Partial<CategoryEntity>): Promise<CategoryEntity>;
}
