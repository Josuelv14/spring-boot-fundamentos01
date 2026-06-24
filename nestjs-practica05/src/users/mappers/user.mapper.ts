import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toModelFromDto(dto: CreateUserDto): UserModel {
    const model = new UserModel();
    model.name = dto.name;
    model.email = dto.email;
    model.password = dto.password;
    model.passwordHash = 'HASH_' + dto.password;
    return model;
  }

  static toModelFromEntity(entity: UserEntity): UserModel {
    const model = new UserModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.passwordHash = entity.passwordHash;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    model.deleted = entity.deleted;
    return model;
  }

  static toEntityFromModel(model: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.name = model.name;
    entity.email = model.email;
    entity.passwordHash = model.passwordHash;
    return entity;
  }

  static toResponse(model: UserModel): UserResponseDto {
    const response = new UserResponseDto();
    response.id = model.id;
    response.name = model.name;
    response.email = model.email;
    return response;
  }
}
