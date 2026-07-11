import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async countProducts(categoryId: number): Promise<number> {
    return this.repository
      .createQueryBuilder('category')
      .innerJoin('category.products', 'product')
      .where('category.id = :categoryId', { categoryId })
      .getCount();
  }

  async save(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
    return this.repository.save(category);
  }
}
