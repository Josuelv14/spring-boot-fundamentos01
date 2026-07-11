import { BaseEntity } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
export declare class ProductEntity extends BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    name: string;
    price: number;
    stock: number;
    description?: string;
    owner: UserEntity;
    categories: CategoryEntity[];
}
