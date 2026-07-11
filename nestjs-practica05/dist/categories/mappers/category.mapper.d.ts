import { CategoryEntity } from '../entities/category.entity';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';
export declare class CategoryMapper {
    static toEntityFromDto(dto: CreateCategoryDto): CategoryEntity;
    static toResponse(entity: CategoryEntity): CategoryResponseDto;
}
