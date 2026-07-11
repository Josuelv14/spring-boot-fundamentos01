import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no debe superar los 150 caracteres' })
  name!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser numérico' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock!: number;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede superar los 500 caracteres' })
  description?: string;

  @IsArray({ message: 'Las categorías deben ser un array' })
  @ArrayNotEmpty({ message: 'Debe especificar al menos una categoría' })
  @IsNumber({}, { each: true, message: 'Cada ID de categoría debe ser un número' })
  @IsPositive({ each: true, message: 'Los IDs de categorías deben ser mayores a 0' })
  categoryIds!: number[];
}
