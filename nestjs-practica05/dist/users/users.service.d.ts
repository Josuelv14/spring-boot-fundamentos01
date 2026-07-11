import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserEntity } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: number): Promise<UserResponseDto>;
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    update(id: number, dto: UpdateUserDto): Promise<UserResponseDto>;
    partialUpdate(id: number, dto: PartialUpdateUserDto): Promise<UserResponseDto>;
    delete(id: number): Promise<void>;
}
