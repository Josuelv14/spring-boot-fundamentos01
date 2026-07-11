import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryMapper } from './mappers/category.mapper';
import { ConflictException } from '../core/exceptions/domain/conflict.exception';
import { NotFoundException } from '../core/exceptions/domain/not-found.exception';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const entities = await this.categoryRepository.findAll();
    return entities.map(CategoryMapper.toResponse);
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const entity = await this.categoryRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Category not found');
    }
    return CategoryMapper.toResponse(entity);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const exists = await this.categoryRepository.existsByName(dto.name);
    if (exists) {
      throw new ConflictException('Category name already registered');
    }
    const entity = CategoryMapper.toEntityFromDto(dto);
    const saved = await this.categoryRepository.save(entity);
    return CategoryMapper.toResponse(saved);
  }

  async countProducts(categoryId: number): Promise<number> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.countProducts(categoryId);
  }
}
