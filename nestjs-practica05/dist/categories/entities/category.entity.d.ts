import { ProductEntity } from '../../products/entities/product.entity';
export declare class CategoryEntity {
    id: number;
    name: string;
    description?: string;
    products: ProductEntity[];
}
