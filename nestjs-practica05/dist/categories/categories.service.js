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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("./repositories/category.repository");
const category_mapper_1 = require("./mappers/category.mapper");
const conflict_exception_1 = require("../core/exceptions/domain/conflict.exception");
const not_found_exception_1 = require("../core/exceptions/domain/not-found.exception");
const product_repository_1 = require("../products/repositories/product.repository");
let CategoriesService = class CategoriesService {
    constructor(categoryRepository, productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    async findAll() {
        const entities = await this.categoryRepository.findAll();
        return entities.map(category_mapper_1.CategoryMapper.toResponse);
    }
    async findOne(id) {
        const entity = await this.categoryRepository.findById(id);
        if (!entity) {
            throw new not_found_exception_1.NotFoundException('Category not found');
        }
        return category_mapper_1.CategoryMapper.toResponse(entity);
    }
    async create(dto) {
        const exists = await this.categoryRepository.existsByName(dto.name);
        if (exists) {
            throw new conflict_exception_1.ConflictException('Category name already registered');
        }
        const entity = category_mapper_1.CategoryMapper.toEntityFromDto(dto);
        const saved = await this.categoryRepository.save(entity);
        return category_mapper_1.CategoryMapper.toResponse(saved);
    }
    async countProducts(categoryId) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) {
            throw new not_found_exception_1.NotFoundException('Category not found');
        }
        return this.productRepository.countByCategory(categoryId);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository,
        product_repository_1.ProductRepository])
], CategoriesService);
