import { InternalServerErrorException } from '@nestjs/common';
import { AccessRightRepository } from './accessRight.repository';
import { createUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
export declare class UsersService {
    private userRepository;
    private accessRightRepository;
    constructor(userRepository: UserRepository, accessRightRepository: AccessRightRepository);
    createUser(createUserDto: createUserDto): Promise<User>;
    createUsersByUpload(res: any, file: any): Promise<void>;
    editUser(editUser: any, userStat: any): Promise<{
        message: string;
    }>;
    deleteUser(id: any): Promise<{
        message: string;
    }>;
    findAllUsers(user: User): Promise<User[]>;
    findOneUser(email: string, nameOnly?: boolean, isForAuth?: boolean): Promise<User | any>;
    findOneUserById(id: string, nameOnly?: boolean, isForAuth?: boolean): Promise<User | any>;
    findAllStudentNumber(): Promise<number | InternalServerErrorException>;
    changeAvatar(id: any, name: any): Promise<any>;
    getAccessRight(id: any): Promise<any>;
}
