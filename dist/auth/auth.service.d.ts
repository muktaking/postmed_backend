import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/users/user.repository";
import { UsersService } from "../users/users.service";
export declare class AuthService {
    private userRepository;
    private readonly usersService;
    private readonly jwtService;
    constructor(userRepository: UserRepository, usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: any;
        id: any;
        expireIn: any;
    }>;
    reset(email: string): Promise<void>;
    resetPassword(token: number, password: string): Promise<{
        message: string;
    }>;
}
