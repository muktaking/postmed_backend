import { InternalServerErrorException } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: UserRepository);
    createUser(createUserDto: createUserDto): Promise<User>;
    createUsersByUpload(res: any, file: any): Promise<void>;
    editUser(editUser: any): Promise<{
        message: string;
    }>;
    deleteUser(id: any): Promise<{
        message: string;
    }>;
    findAllUsers(userRole: any): Promise<User[]>;
    findOneUser(email: string, nameOnly?: boolean, isForAuth?: boolean): Promise<User | any>;
    findAllStudentNumber(): Promise<number | InternalServerErrorException>;
    changeAvatar(id: any, name: any): Promise<any>;
}
