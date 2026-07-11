import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { UserResponseDto } from '../dtos/user-response.dto';
export declare class UserMapper {
    static toModelFromDto(dto: CreateUserDto): UserModel;
    static toModelFromEntity(entity: UserEntity): UserModel;
    static toEntityFromModel(model: UserModel): UserEntity;
    static toResponse(model: UserModel): UserResponseDto;
}
