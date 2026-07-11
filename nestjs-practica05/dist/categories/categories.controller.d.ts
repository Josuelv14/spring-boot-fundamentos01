import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryResponseDto } from './dtos/category-response.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<CategoryResponseDto[]>;
    findOne(id: string): Promise<CategoryResponseDto>;
    countProducts(id: string): Promise<number>;
    create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
}
