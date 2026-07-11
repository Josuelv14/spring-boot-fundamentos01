"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conflict_exception_1 = require("../core/exceptions/domain/conflict.exception");
const not_found_exception_1 = require("../core/exceptions/domain/not-found.exception");
const user_entity_1 = require("./entities/user.entity");
const user_mapper_1 = require("./mappers/user.mapper");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll() {
        const entities = await this.userRepository.find({
            where: { deleted: false },
        });
        return entities.map(user_mapper_1.UserMapper.toModelFromEntity).map(user_mapper_1.UserMapper.toResponse);
    }
    async findOne(id) {
        const entity = await this.userRepository.findOne({
            where: { id, deleted: false },
        });
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('User not found');
        }
        return user_mapper_1.UserMapper.toResponse(user_mapper_1.UserMapper.toModelFromEntity(entity));
    }
    async create(dto) {
        const exists = await this.userRepository.exist({
            where: { email: dto.email, deleted: false },
        });
        if (exists) {
            throw new conflict_exception_1.ConflictException('Email already registered');
        }
        const model = user_mapper_1.UserMapper.toModelFromDto(dto);
        const entity = user_mapper_1.UserMapper.toEntityFromModel(model);
        const savedEntity = await this.userRepository.save(entity);
        return user_mapper_1.UserMapper.toResponse(user_mapper_1.UserMapper.toModelFromEntity(savedEntity));
    }
    async update(id, dto) {
        const entity = await this.userRepository.findOne({
            where: { id, deleted: false },
        });
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('User not found');
        }
        entity.name = dto.name;
        entity.email = dto.email;
        const saved = await this.userRepository.save(entity);
        return user_mapper_1.UserMapper.toResponse(user_mapper_1.UserMapper.toModelFromEntity(saved));
    }
    async partialUpdate(id, dto) {
        const entity = await this.userRepository.findOne({
            where: { id, deleted: false },
        });
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('User not found');
        }
        if (dto.name !== undefined) {
            entity.name = dto.name;
        }
        if (dto.email !== undefined) {
            entity.email = dto.email;
        }
        if (dto.password !== undefined) {
            entity.passwordHash = 'HASH_' + dto.password;
        }
        const saved = await this.userRepository.save(entity);
        return user_mapper_1.UserMapper.toResponse(user_mapper_1.UserMapper.toModelFromEntity(saved));
    }
    async delete(id) {
        const entity = await this.userRepository.findOne({
            where: { id, deleted: false },
        });
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('User not found');
        }
        entity.deleted = true;
        await this.userRepository.save(entity);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
