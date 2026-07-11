import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 120, { message: 'El nombre debe tener entre 3 y 120 caracteres' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(500, { message: 'La descripción no puede superar los 500 caracteres' })
  description?: string;
}
