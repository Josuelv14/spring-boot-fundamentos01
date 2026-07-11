import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return this.repository.find({
      where: { deleted: false },
      relations: ['owner', 'categories'],
    });
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return this.repository.findOne({
      where: { id, deleted: false },
      relations: ['owner', 'categories'],
    });
  }

  async findByName(name: string): Promise<ProductEntity | null> {
    return this.repository.findOne({
      where: { name, deleted: false },
    });
  }

  async findByOwnerId(userId: number): Promise<ProductEntity[]> {
    return this.repository.find({
      where: { owner: { id: userId }, deleted: false },
      relations: ['owner', 'categories'],
    });
  }

  // ============== NUEVO: Consulta con filtros dinámicos ==============

  /**
   * Encuentra productos de un usuario con filtros opcionales usando QueryBuilder
   * 
   * Características:
   * - Filtros opcionales: solo se aplican si están definidos
   * - Búsqueda de nombre: parcial e insensible a mayúsculas/minúsculas
   * - Filtros de precio: rango flexible
   * - Filtro de categoría: opcional
   * - Ordenamiento: por fecha de creación (más recientes primero)
   * 
   * SQL generado aproximadamente:
   * SELECT product.*, owner.id, owner.name, owner.email, category.id, category.name
   * FROM products product
   * INNER JOIN users owner ON product.user_id = owner.id
   * LEFT JOIN product_categories pc ON product.id = pc.product_id
   * LEFT JOIN categories category ON pc.category_id = category.id
   * WHERE product.deleted = false
   *   AND owner.id = $userId
   *   AND (LOWER(product.name) LIKE LOWER($name))
   *   AND (product.price >= $minPrice)
   *   AND (product.price <= $maxPrice)
   *   AND (category.id = $categoryId)
   * ORDER BY product.created_at DESC
   * 
   * @param userId - ID del usuario propietario (obligatorio)
   * @param name - Filtro opcional: búsqueda parcial en nombre del producto
   * @param minPrice - Filtro opcional: precio mínimo
   * @param maxPrice - Filtro opcional: precio máximo
   * @param categoryId - Filtro opcional: ID de categoría
   * @returns Array de ProductEntity con relaciones cargadas
   */
  async findByOwnerIdWithFilters(
    userId: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    categoryId?: number,
  ): Promise<ProductEntity[]> {
    // Construir QueryBuilder con joins explícitos
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.owner', 'owner')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.deleted = false')
      .andWhere('owner.id = :userId', { userId });

    // Filtro por nombre (búsqueda parcial, case-insensitive)
    if (name) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    // Filtro por precio mínimo
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    // Filtro por precio máximo
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Filtro por categoría
    if (categoryId !== undefined) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    // Ordenar por fecha de creación (más recientes primero)
    queryBuilder.orderBy('product.createdAt', 'DESC');

    // Eliminar duplicados si hay múltiples categorías (por el LEFT JOIN)
    queryBuilder.distinct(true);

    return queryBuilder.getMany();
  }

  async findByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    return this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.owner', 'owner')
      .leftJoinAndSelect('product.categories', 'category')
      .where('product.deleted = false')
      .andWhere('category.id = :categoryId', { categoryId })
      .getMany();
  }

  async countByCategory(categoryId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('product.deleted = false')
      .andWhere('category.id = :categoryId', { categoryId })
      .getCount();

    return result;
  }

  async save(product: Partial<ProductEntity>): Promise<ProductEntity> {
    return this.repository.save(product);
  }

  async remove(product: ProductEntity): Promise<void> {
    await this.repository.remove(product);
  }
}
