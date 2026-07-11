import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

// Importar entidades y repositorios relacionados
import { ProductEntity } from '../products/entities/product.entity';
import { ProductRepository } from '../products/repositories/product.repository';

@Module({
  imports: [
    // Registrar ambas entidades (User y Product) para poder hacer consultas relacionadas
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    ProductRepository, // Inyectar repositorio de productos para consultas relacionadas
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
