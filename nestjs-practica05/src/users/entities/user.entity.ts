import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ default: false })
  deleted!: boolean;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  passwordHash!: string;

  // ==================== RELACIÓN BIDIRECCIONAL ====================
  /**
   * Relación One-to-Many con ProductEntity
   * Esta relación existe para consistencia del modelo y documentación
   * NO debe usarse para consultas desde el servicio - usar ProductRepository en su lugar
   */
  @OneToMany(() => ProductEntity, (product) => product.owner, { lazy: true })
  products!: ProductEntity[];
}
