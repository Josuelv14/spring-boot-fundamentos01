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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const conflict_exception_1 = require("../core/exceptions/domain/conflict.exception");
const not_found_exception_1 = require("../core/exceptions/domain/not-found.exception");
const product_entity_1 = require("./entities/product.entity");
const product_mapper_1 = require("./mappers/product.mapper");
const product_repository_1 = require("./repositories/product.repository");
const user_repository_1 = require("../users/repositories/user.repository");
const category_repository_1 = require("../categories/repositories/category.repository");
let ProductsService = class ProductsService {
    constructor(productRepository, userRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }
    async findAll() {
        const entities = await this.productRepository.findAll();
        return entities.map(product_mapper_1.ProductMapper.toResponseFromEntity);
    }
    async findOne(id) {
        const entity = await this.productRepository.findById(id);
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('Product not found');
        }
        return product_mapper_1.ProductMapper.toResponseFromEntity(entity);
    }
    async create(dto) {
        const exists = await this.productRepository.findByName(dto.name);
        if (exists) {
            throw new conflict_exception_1.ConflictException('Product name already registered');
        }
        const owner = await this.userRepository.findById(dto.userId);
        if (!owner) {
            throw new not_found_exception_1.NotFoundException(`User not found with id: ${dto.userId}`);
        }
        const categories = await this.validateAndGetCategories(dto.categoryIds);
        const entity = new product_entity_1.ProductEntity();
        entity.name = dto.name;
        entity.price = dto.price;
        entity.stock = dto.stock;
        entity.description = dto.description;
        entity.owner = owner;
        entity.categories = categories;
        const saved = await this.productRepository.save(entity);
        const savedWithRelations = await this.productRepository.findById(saved.id);
        if (!savedWithRelations) {
            throw new not_found_exception_1.NotFoundException('Product not found after saving');
        }
        return product_mapper_1.ProductMapper.toResponseFromEntity(savedWithRelations);
    }
    async update(id, dto) {
        const entity = await this.productRepository.findById(id);
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('Product not found');
        }
        entity.name = dto.name;
        entity.price = dto.price;
        entity.stock = dto.stock;
        entity.description = dto.description;
        entity.categories = await this.validateAndGetCategories(dto.categoryIds);
        const saved = await this.productRepository.save(entity);
        const savedWithRelations = await this.productRepository.findById(saved.id);
        if (!savedWithRelations) {
            throw new not_found_exception_1.NotFoundException('Product not found after saving');
        }
        return product_mapper_1.ProductMapper.toResponseFromEntity(savedWithRelations);
    }
    async partialUpdate(id, dto) {
        const entity = await this.productRepository.findById(id);
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('Product not found');
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
            throw new not_found_exception_1.NotFoundException('Product not found after saving');
        }
        return product_mapper_1.ProductMapper.toResponseFromEntity(savedWithRelations);
    }
    async delete(id) {
        const entity = await this.productRepository.findById(id);
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('Product not found');
        }
        entity.deleted = true;
        await this.productRepository.save(entity);
    }
    async findByOwnerId(userId) {
        const entities = await this.productRepository.findByOwnerId(userId);
        return entities.map(product_mapper_1.ProductMapper.toResponseFromEntity);
    }
    async findByCategoryId(categoryId) {
        const entities = await this.productRepository.findByCategoryId(categoryId);
        return entities.map(product_mapper_1.ProductMapper.toResponseFromEntity);
    }
    async validateAndGetCategories(categoryIds) {
        const categories = [];
        for (const categoryId of categoryIds) {
            const category = await this.categoryRepository.findById(categoryId);
            if (!category) {
                throw new not_found_exception_1.NotFoundException(`Category not found with id: ${categoryId}`);
            }
            categories.push(category);
        }
        return categories;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository,
        user_repository_1.UserRepository,
        category_repository_1.CategoryRepository])
], ProductsService);
