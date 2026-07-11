import { CreateProductDto } from './dtos/create-product.dto';
import { PartialUpdateProductDto } from './dtos/partial-update-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductRepository } from './repositories/product.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { CategoryRepository } from '../categories/repositories/category.repository';
export declare class ProductsService {
    private readonly productRepository;
    private readonly userRepository;
    private readonly categoryRepository;
    constructor(productRepository: ProductRepository, userRepository: UserRepository, categoryRepository: CategoryRepository);
    findAll(): Promise<ProductResponseDto[]>;
    findOne(id: number): Promise<ProductResponseDto>;
    create(dto: CreateProductDto): Promise<ProductResponseDto>;
    update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto>;
    partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto>;
    delete(id: number): Promise<void>;
    findByOwnerId(userId: number): Promise<ProductResponseDto[]>;
    findByCategoryId(categoryId: number): Promise<ProductResponseDto[]>;
    private validateAndGetCategories;
}
