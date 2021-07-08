import { UsersService } from './users.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUserById(req: any): Promise<any>;
    changeAvatar(req: any, name: any): Promise<any>;
    createUsersByUpload(res: any, file: string): Promise<void>;
    editUser(editUser: any, req: any): Promise<any>;
    deleteUser(id: any): Promise<{
        message: string;
    }>;
}
