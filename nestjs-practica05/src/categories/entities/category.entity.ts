import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @ManyToMany(() => ProductEntity, (product) => product.categories)
  products!: ProductEntity[];
}
