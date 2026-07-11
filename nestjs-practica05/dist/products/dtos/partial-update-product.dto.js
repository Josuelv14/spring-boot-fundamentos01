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
exports.PartialUpdateProductDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PartialUpdateProductDto {
}
exports.PartialUpdateProductDto = PartialUpdateProductDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    (0, class_validator_1.MaxLength)(150, { message: 'El nombre no debe superar los 150 caracteres' }),
    __metadata("design:type", String)
], PartialUpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'El precio debe ser numérico' }),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser negativo' }),
    __metadata("design:type", Number)
], PartialUpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'El stock debe ser numérico' }),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    __metadata("design:type", Number)
], PartialUpdateProductDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser un texto' }),
    (0, class_validator_1.Length)(0, 500, { message: 'La descripción no puede superar los 500 caracteres' }),
    __metadata("design:type", String)
], PartialUpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las categorías deben ser un array' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Debe especificar al menos una categoría' }),
    (0, class_validator_1.IsNumber)({}, { each: true, message: 'Cada ID de categoría debe ser un número' }),
    (0, class_validator_1.IsPositive)({ each: true, message: 'Los IDs de categorías deben ser mayores a 0' }),
    __metadata("design:type", Array)
], PartialUpdateProductDto.prototype, "categoryIds", void 0);
