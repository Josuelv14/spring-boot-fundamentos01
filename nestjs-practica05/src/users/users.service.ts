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
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
}
