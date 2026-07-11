import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductModel } from '../models/product.model';
import { ProductResponseDto } from '../dtos/product-response.dto';
export declare class ProductMapper {
    static toModelFromDto(dto: CreateProductDto): ProductModel;
    static toModelFromEntity(entity: ProductEntity): ProductModel;
    static toEntityFromModel(model: ProductModel): ProductEntity;
    static toResponse(model: ProductModel): ProductResponseDto;
    static toResponseFromEntity(entity: ProductEntity): ProductResponseDto;
}
