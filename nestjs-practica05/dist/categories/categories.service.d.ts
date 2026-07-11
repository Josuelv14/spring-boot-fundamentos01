import { CategoryRepository } from './repositories/category.repository';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ProductRepository } from '../products/repositories/product.repository';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly productRepository;
    constructor(categoryRepository: CategoryRepository, productRepository: ProductRepository);
    findAll(): Promise<CategoryResponseDto[]>;
    findOne(id: number): Promise<CategoryResponseDto>;
    create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
    countProducts(categoryId: number): Promise<number>;
}
