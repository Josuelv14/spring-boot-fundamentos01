"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const product_entity_1 = require("../entities/product.entity");
const product_model_1 = require("../models/product.model");
const product_response_dto_1 = require("../dtos/product-response.dto");
class ProductMapper {
    static toModelFromDto(dto) {
        const model = new product_model_1.ProductModel();
        model.name = dto.name;
        model.price = dto.price;
        model.stock = dto.stock;
        return model;
    }
    static toModelFromEntity(entity) {
        const model = new product_model_1.ProductModel();
        model.id = entity.id;
        model.name = entity.name;
        model.price = Number(entity.price);
        model.stock = entity.stock;
        model.createdAt = entity.createdAt;
        model.updatedAt = entity.updatedAt;
        model.deleted = entity.deleted;
        return model;
    }
    static toEntityFromModel(model) {
        const entity = new product_entity_1.ProductEntity();
        entity.name = model.name;
        entity.price = model.price;
        entity.stock = model.stock;
        return entity;
    }
    static toResponse(model) {
        const response = new product_response_dto_1.ProductResponseDto();
        response.id = model.id;
        response.name = model.name;
        response.price = model.price;
        response.stock = model.stock;
        return response;
    }
    static toResponseFromEntity(entity) {
        const response = new product_response_dto_1.ProductResponseDto();
        response.id = entity.id;
        response.name = entity.name;
        response.price = Number(entity.price);
        response.stock = entity.stock;
        response.description = entity.description;
        response.user = {
            id: entity.owner.id,
            name: entity.owner.name,
            email: entity.owner.email,
        };
        response.categories = entity.categories?.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
        })) ?? [];
        response.createdAt = entity.createdAt;
        response.updatedAt = entity.updatedAt;
        return response;
    }
}
exports.ProductMapper = ProductMapper;
