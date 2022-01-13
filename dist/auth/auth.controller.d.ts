import { createUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    signUp(createUserDto: createUserDto): Promise<import("../users/user.entity").User>;
    logIn(req: any): Promise<{
        accessToken: any;
        id: any;
        expireIn: any;
    }>;
    facebookLogin(data: any): Promise<any>;
    reset(email: string): Promise<void>;
    resetPassword(reset: {
        token: number;
        password: string;
    }): Promise<{
        message: string;
    }>;
}
