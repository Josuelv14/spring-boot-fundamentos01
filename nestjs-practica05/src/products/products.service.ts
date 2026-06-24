import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '../core/exceptions/domain/conflict.exception';
import { NotFoundException } from '../core/exceptions/domain/not-found.exception';
import { BadRequestException } from '../core/exceptions/domain/bad-request.exception';
import { CreateProductDto } from './dtos/create-product.dto';
import { PartialUpdateProductDto } from './dtos/partial-update-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find({
      where: { deleted: false },
    });
    return entities.map(ProductMapper.toModelFromEntity).map(ProductMapper.toResponse);
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    return ProductMapper.toResponse(ProductMapper.toModelFromEntity(entity));
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const exists = await this.productRepository.findOne({
      where: { name: dto.name, deleted: false },
    });

    if (exists) {
      throw new ConflictException('Product name already registered');
    }

    const model = ProductMapper.toModelFromDto(dto);
    const entity = ProductMapper.toEntityFromModel(model);
    const savedEntity = await this.productRepository.save(entity);
    return ProductMapper.toResponse(ProductMapper.toModelFromEntity(savedEntity));
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    entity.name = dto.name;
    entity.price = dto.price;
    entity.stock = dto.stock;
    const saved = await this.productRepository.save(entity);
    return ProductMapper.toResponse(ProductMapper.toModelFromEntity(saved));
  }

  async partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
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
    const saved = await this.productRepository.save(entity);
    return ProductMapper.toResponse(ProductMapper.toModelFromEntity(saved));
  }

  async delete(id: number): Promise<void> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Product not found');
    }
    entity.deleted = true;
    await this.productRepository.save(entity);
  }
}
