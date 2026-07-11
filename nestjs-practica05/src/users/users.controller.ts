import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseFloatPipe,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ProductResponseDto } from '../products/dtos/product-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  // ============== ENDPOINTS BÁSICOS DE USUARIOS ==============

  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.service.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.service.update(Number(id), dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: PartialUpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.service.partialUpdate(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(Number(id));
  }

  // ============== ENDPOINTS DE CONSULTAS RELACIONADAS ==============

  /**
   * Obtiene todos los productos de un usuario específico
   * Contexto semántico: /users/{id}/products
   * 
   * Ejemplo: GET /users/123/products
   * 
   * @param id - ID del usuario propietario de los productos
   * @returns Array de ProductResponseDto
   * @throws NotFoundException - Si el usuario no existe
   */
  @Get(':id/products')
  async getProducts(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponseDto[]> {
    return this.service.getProductsByUserId(id);
  }

  /**
   * Obtiene productos de un usuario con filtros opcionales
   * Contexto semántico: /users/{id}/products con parámetros de query
   * 
   * Ejemplos:
   * - GET /users/123/products-v2?name=laptop
   * - GET /users/123/products-v2?minPrice=500&maxPrice=1500
   * - GET /users/123/products-v2?categoryId=2
   * - GET /users/123/products-v2?name=gaming&minPrice=800&categoryId=2
   * 
   * @param id - ID del usuario propietario de los productos
   * @param name - Filtro opcional: búsqueda parcial en nombre del producto
   * @param minPrice - Filtro opcional: precio mínimo
   * @param maxPrice - Filtro opcional: precio máximo
   * @param categoryId - Filtro opcional: ID de categoría
   * @returns Array de ProductResponseDto filtrados
   * @throws NotFoundException - Si el usuario no existe
   * @throws BadRequestException - Si los filtros son inválidos
   */
  @Get(':id/products-v2')
  async getProductsWithFilters(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name?: string,
    @Query('minPrice') minPriceStr?: string,
    @Query('maxPrice') maxPriceStr?: string,
    @Query('categoryId') categoryIdStr?: string,
  ): Promise<ProductResponseDto[]> {
    // Conversión segura de parámetros numéricos
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;
    let categoryId: number | undefined = undefined;

    // Convertir minPrice si se proporciona
    if (minPriceStr !== undefined) {
      minPrice = parseFloat(minPriceStr);
      if (isNaN(minPrice)) {
        throw new BadRequestException('El parámetro minPrice debe ser un número válido');
      }
    }

    // Convertir maxPrice si se proporciona
    if (maxPriceStr !== undefined) {
      maxPrice = parseFloat(maxPriceStr);
      if (isNaN(maxPrice)) {
        throw new BadRequestException('El parámetro maxPrice debe ser un número válido');
      }
    }

    // Convertir categoryId si se proporciona
    if (categoryIdStr !== undefined) {
      categoryId = parseInt(categoryIdStr, 10);
      if (isNaN(categoryId)) {
        throw new BadRequestException('El parámetro categoryId debe ser un número entero válido');
      }
    }

    // Validación de rango de precios
    if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
      throw new BadRequestException(
        'El precio máximo debe ser mayor o igual al precio mínimo',
      );
    }

    return this.service.getProductsByUserIdWithFilters(
      id,
      name,
      minPrice,
      maxPrice,
      categoryId,
    );
  }

  /**
   * Versión alternativa con DTO para validación más robusta
   * Obtiene productos de un usuario con filtros opcionales (usando DTO)
   * 
   * Ejemplo: GET /users/123/products-v3?name=laptop&minPrice=500&maxPrice=1500
   * 
   * @param id - ID del usuario propietario de los productos
   * @param filters - Objeto con filtros validados por ProductFilterDto
   * @returns Array de ProductResponseDto filtrados
   * @throws NotFoundException - Si el usuario no existe
   * @throws BadRequestException - Si los filtros son inválidos
   */
  @Get(':id/products-v3')
  async getProductsWithFiltersDto(
    @Param('id', ParseIntPipe) id: number,
    @Query(ValidationPipe) filters: ProductFilterDto,
  ): Promise<ProductResponseDto[]> {
    // Validación adicional de negocio
    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.maxPrice < filters.minPrice
    ) {
      throw new BadRequestException(
        'El precio máximo debe ser mayor o igual al precio mínimo',
      );
    }

    return this.service.getProductsByUserIdWithFilters(
      id,
      filters.name,
      filters.minPrice,
      filters.maxPrice,
      filters.categoryId,
    );
  }
}
