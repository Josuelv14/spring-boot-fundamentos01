import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no debe superar los 150 caracteres' })
  name: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser numérico' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;
}
