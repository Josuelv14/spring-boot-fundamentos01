import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '../core/exceptions/domain/conflict.exception';
import { NotFoundException } from '../core/exceptions/domain/not-found.exception';
import { BadRequestException } from '../core/exceptions/domain/bad-request.exception';
import { CreateUserDto } from './dtos/create-user.dto';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ProductResponseDto } from '../products/dtos/product-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { ProductMapper } from '../products/mappers/product.mapper';
import { UserRepository } from './repositories/user.repository';
import { ProductRepository } from '../products/repositories/product.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userRepo: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  // ============== MÉTODOS BÁSICOS DE USUARIOS ==============

  async findAll(): Promise<UserResponseDto[]> {
    const entities = await this.userRepository.find({
      where: { deleted: false },
    });
    return entities.map(UserMapper.toModelFromEntity).map(UserMapper.toResponse);
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponse(UserMapper.toModelFromEntity(entity));
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.userRepository.exist({
      where: { email: dto.email, deleted: false },
    });

    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const model = UserMapper.toModelFromDto(dto);
    const entity = UserMapper.toEntityFromModel(model);
    const savedEntity = await this.userRepository.save(entity);
    return UserMapper.toResponse(UserMapper.toModelFromEntity(savedEntity));
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    entity.name = dto.name;
    entity.email = dto.email;
    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(UserMapper.toModelFromEntity(saved));
  }

  async partialUpdate(id: number, dto: PartialUpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
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
    return UserMapper.toResponse(UserMapper.toModelFromEntity(saved));
  }

  async delete(id: number): Promise<void> {
    const entity = await this.userRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    entity.deleted = true;
    await this.userRepository.save(entity);
  }

  // ============== MÉTODOS PARA CONSULTAS RELACIONADAS ==============

  /**
   * Obtiene todos los productos de un usuario específico
   * 
   * Proceso:
   * 1. Valida que el usuario existe
   * 2. Consulta explícita al ProductRepository (NOT navegación de relaciones)
   * 3. Mapea entidades a DTOs
   * 
   * @param userId - ID del usuario propietario
   * @returns Array de ProductResponseDto
   * @throws NotFoundException - Si el usuario no existe
   */
  async getProductsByUserId(userId: number): Promise<ProductResponseDto[]> {
    // 1. Validar que el usuario existe
    const userExists = await this.userRepo.findById(userId);
    if (!userExists) {
      throw new NotFoundException(`Usuario no encontrado con ID: ${userId}`);
    }

    // 2. Consulta explícita al repositorio correcto (ProductRepository, NO UserRepository)
    const products = await this.productRepository.findByOwnerId(userId);

    // 3. Mapear a DTOs
    return products.map((product) => ProductMapper.toResponseFromEntity(product));
  }

  /**
   * Obtiene productos de un usuario con filtros opcionales
   * 
   * Proceso:
   * 1. Valida que el usuario existe
   * 2. Valida los filtros de negocio
   * 3. Consulta con filtros al ProductRepository usando QueryBuilder
   * 4. Mapea entidades a DTOs
   * 
   * @param userId - ID del usuario propietario
   * @param name - Filtro opcional: búsqueda parcial en nombre
   * @param minPrice - Filtro opcional: precio mínimo
   * @param maxPrice - Filtro opcional: precio máximo
   * @param categoryId - Filtro opcional: ID de categoría
   * @returns Array de ProductResponseDto filtrados
   * @throws NotFoundException - Si el usuario no existe
   * @throws BadRequestException - Si los filtros son inválidos
   */
  async getProductsByUserIdWithFilters(
    userId: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    categoryId?: number,
  ): Promise<ProductResponseDto[]> {
    // 1. Validar que el usuario existe
    const userExists = await this.userRepo.findById(userId);
    if (!userExists) {
      throw new NotFoundException(`Usuario no encontrado con ID: ${userId}`);
    }

    // 2. Validaciones de filtros de negocio
    if (minPrice !== undefined && minPrice < 0) {
      throw new BadRequestException('El precio mínimo no puede ser negativo');
    }

    if (maxPrice !== undefined && maxPrice < 0) {
      throw new BadRequestException('El precio máximo no puede ser negativo');
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      maxPrice < minPrice
    ) {
      throw new BadRequestException(
        'El precio máximo debe ser mayor o igual al precio mínimo',
      );
    }

    // 3. Consulta con filtros al repositorio correcto
    const products = await this.productRepository.findByOwnerIdWithFilters(
      userId,
      name,
      minPrice,
      maxPrice,
      categoryId,
    );

    // 4. Mapear a DTOs
    return products.map((product) => ProductMapper.toResponseFromEntity(product));
  }
}
