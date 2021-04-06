import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUserById(req: any): Promise<any>;
    changeAvatar(req: any, name: any): Promise<any>;
}
