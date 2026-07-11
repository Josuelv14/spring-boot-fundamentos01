import { CreateUserDto } from './dtos/create-user.dto';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    findAll(): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    partialUpdate(id: string, dto: PartialUpdateUserDto): Promise<UserResponseDto>;
    delete(id: string): Promise<void>;
}
