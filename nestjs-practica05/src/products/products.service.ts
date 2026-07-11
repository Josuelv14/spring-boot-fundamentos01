import { Injectable } from '@nestjs/common';
import { ConflictException } from '../core/exceptions/domain/conflict.exception';
import { NotFoundException } from '../core/exceptions/domain/not-found.exception';
import { CreateProductDto } from './dtos/create-product.dto';
import { PartialUpdateProductDto } from './dtos/partial-update-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { ProductRepository } from './repositories/product.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { CategoryRepository } from '../categories/repositories/category.repository';
import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.findAll();
    return entities.map(ProductMapper.toResponseFromEntity);
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    return ProductMapper.toResponseFromEntity(entity);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const exists = await this.productRepository.findByName(dto.name);
    if (exists) {
      throw new ConflictException('Product name already registered');
    }

    const owner = await this.userRepository.findById(dto.userId);
    if (!owner) {
      throw new NotFoundException(`User not found with id: ${dto.userId}`);
    }

    const categories = await this.validateAndGetCategories(dto.categoryIds);

    const entity = new ProductEntity();
    entity.name = dto.name;
    entity.price = dto.price;
    entity.stock = dto.stock;
    entity.description = dto.description;
    entity.owner = owner;
    entity.categories = categories;

    const saved = await this.productRepository.save(entity);
    const savedWithRelations = await this.productRepository.findById(saved.id);
    if (!savedWithRelations) {
      throw new NotFoundException('Product not found after saving');
    }
    return ProductMapper.toResponseFromEntity(savedWithRelations);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product not found');
    }

    entity.name = dto.name;
    entity.price = dto.price;
    entity.stock = dto.stock;
    entity.description = dto.description;
    entity.categories = await this.validateAndGetCategories(dto.categoryIds);

    const saved = await this.productRepository.save(entity);
    const savedWithRelations = await this.productRepository.findById(saved.id);
    if (!savedWithRelations) {
      throw new NotFoundException('Product not found after saving');
    }
    return ProductMapper.toResponseFromEntity(savedWithRelations);
  }

  async partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    if (dto.name !== undefined) {
      entity.name = dto.name;
    }
    if (dto.price !== undefined) {
      entity.price = dto.price;
    }
    if (dto.stock !== undefined) {
      entity.stock = dto.stock;
    }
    if (dto.description !== undefined) {
      entity.description = dto.description;
    }
    if (dto.categoryIds !== undefined) {
      entity.categories = await this.validateAndGetCategories(dto.categoryIds);
    }
    const saved = await this.productRepository.save(entity);
    const savedWithRelations = await this.productRepository.findById(saved.id);
    if (!savedWithRelations) {
      throw new NotFoundException('Product not found after saving');
    }
    return ProductMapper.toResponseFromEntity(savedWithRelations);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.productRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    entity.deleted = true;
    await this.productRepository.save(entity);
  }

  async findByOwnerId(userId: number): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.findByOwnerId(userId);
    return entities.map(ProductMapper.toResponseFromEntity);
  }

  async findByCategoryId(categoryId: number): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.findByCategoryId(categoryId);
    return entities.map(ProductMapper.toResponseFromEntity);
  }

  private async validateAndGetCategories(categoryIds: number[]): Promise<CategoryEntity[]> {
    const categories: CategoryEntity[] = [];
    for (const categoryId of categoryIds) {
      const category = await this.categoryRepository.findById(categoryId);
      if (!category) {
        throw new NotFoundException(`Category not found with id: ${categoryId}`);
      }
      categories.push(category);
    }
    return categories;
  }
}
