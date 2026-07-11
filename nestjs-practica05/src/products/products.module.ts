import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { CategoryRepository } from '../categories/repositories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity, CategoryEntity]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepository,
    UserRepository,
    CategoryRepository,
  ],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
