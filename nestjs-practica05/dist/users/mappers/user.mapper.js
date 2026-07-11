"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("../entities/user.entity");
const user_model_1 = require("../models/user.model");
const user_response_dto_1 = require("../dtos/user-response.dto");
class UserMapper {
    static toModelFromDto(dto) {
        const model = new user_model_1.UserModel();
        model.name = dto.name;
        model.email = dto.email;
        model.password = dto.password;
        model.passwordHash = 'HASH_' + dto.password;
        return model;
    }
    static toModelFromEntity(entity) {
        const model = new user_model_1.UserModel();
        model.id = entity.id;
        model.name = entity.name;
        model.email = entity.email;
        model.passwordHash = entity.passwordHash;
        model.createdAt = entity.createdAt;
        model.updatedAt = entity.updatedAt;
        model.deleted = entity.deleted;
        return model;
    }
    static toEntityFromModel(model) {
        const entity = new user_entity_1.UserEntity();
        entity.name = model.name;
        entity.email = model.email;
        entity.passwordHash = model.passwordHash;
        return entity;
    }
    static toResponse(model) {
        const response = new user_response_dto_1.UserResponseDto();
        response.id = model.id;
        response.name = model.name;
        response.email = model.email;
        return response;
    }
}
exports.UserMapper = UserMapper;
