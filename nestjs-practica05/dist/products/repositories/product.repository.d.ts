import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
export declare class ProductRepository {
    private readonly repository;
    constructor(repository: Repository<ProductEntity>);
    findAll(): Promise<ProductEntity[]>;
    findById(id: number): Promise<ProductEntity | null>;
    findByName(name: string): Promise<ProductEntity | null>;
    findByOwnerId(userId: number): Promise<ProductEntity[]>;
    findByCategoryId(categoryId: number): Promise<ProductEntity[]>;
    countByCategory(categoryId: number): Promise<number>;
    save(product: Partial<ProductEntity>): Promise<ProductEntity>;
    remove(product: ProductEntity): Promise<void>;
}
