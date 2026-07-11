import { CategoryEntity } from '../entities/category.entity';
import { CategoryResponseDto } from '../dtos/category-response.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';

export class CategoryMapper {
  static toEntityFromDto(dto: CreateCategoryDto): CategoryEntity {
    const entity = new CategoryEntity();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static toResponse(entity: CategoryEntity): CategoryResponseDto {
    const response = new CategoryResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.description = entity.description;
    return response;
  }
}
