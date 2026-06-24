import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PartialUpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no debe superar los 150 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Debe ingresar un email válido' })
  @MaxLength(150, { message: 'El email no debe superar los 150 caracteres' })
  email?: string;
}
