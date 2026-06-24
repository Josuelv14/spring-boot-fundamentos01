import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductModel } from '../models/product.model';
import { ProductResponseDto } from '../dtos/product-response.dto';

export class ProductMapper {
  static toModelFromDto(dto: CreateProductDto): ProductModel {
    const model = new ProductModel();
    model.name = dto.name;
    model.price = dto.price;
    model.stock = dto.stock;
    return model;
  }

  static toModelFromEntity(entity: ProductEntity): ProductModel {
    const model = new ProductModel();
    model.id = entity.id;
    model.name = entity.name;
    model.price = Number(entity.price);
    model.stock = entity.stock;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    model.deleted = entity.deleted;
    return model;
  }

  static toEntityFromModel(model: ProductModel): ProductEntity {
    const entity = new ProductEntity();
    entity.name = model.name;
    entity.price = model.price;
    entity.stock = model.stock;
    return entity;
  }

  static toResponse(model: ProductModel): ProductResponseDto {
    const response = new ProductResponseDto();
    response.id = model.id;
    response.name = model.name;
    response.price = model.price;
    response.stock = model.stock;
    return response;
  }
}
