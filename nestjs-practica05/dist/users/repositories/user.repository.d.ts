import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
export declare class UserRepository {
    private readonly repository;
    constructor(repository: Repository<UserEntity>);
    findById(id: number): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    save(user: Partial<UserEntity>): Promise<UserEntity>;
}
