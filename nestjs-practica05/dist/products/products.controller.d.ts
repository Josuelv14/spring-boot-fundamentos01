import { CreateProductDto } from './dtos/create-product.dto';
import { PartialUpdateProductDto } from './dtos/partial-update-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    create(dto: CreateProductDto): Promise<ProductResponseDto>;
    findAll(): Promise<ProductResponseDto[]>;
    findOne(id: string): Promise<ProductResponseDto>;
    update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto>;
    partialUpdate(id: string, dto: PartialUpdateProductDto): Promise<ProductResponseDto>;
    delete(id: string): Promise<void>;
    findByOwnerId(userId: string): Promise<ProductResponseDto[]>;
    findByCategoryId(categoryId: string): Promise<ProductResponseDto[]>;
}
