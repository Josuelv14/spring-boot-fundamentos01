import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para filtros opcionales en consultas de productos de un usuario
 * Utilizado en: GET /api/users/{id}/products-v2?name=...&minPrice=...&maxPrice=...&categoryId=...
 */
export class ProductFilterDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio mínimo debe ser un número válido' })
  @Min(0, { message: 'El precio mínimo debe ser mayor o igual a 0' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número válido' })
  @Min(0, { message: 'El precio máximo debe ser mayor o igual a 0' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID de categoría debe ser un número válido' })
  @IsPositive({ message: 'El ID de categoría debe ser positivo' })
  categoryId?: number;
}
