"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMapper = void 0;
const category_entity_1 = require("../entities/category.entity");
const category_response_dto_1 = require("../dtos/category-response.dto");
class CategoryMapper {
    static toEntityFromDto(dto) {
        const entity = new category_entity_1.CategoryEntity();
        entity.name = dto.name;
        entity.description = dto.description;
        return entity;
    }
    static toResponse(entity) {
        const response = new category_response_dto_1.CategoryResponseDto();
        response.id = entity.id;
        response.name = entity.name;
        response.description = entity.description;
        return response;
    }
}
exports.CategoryMapper = CategoryMapper;
