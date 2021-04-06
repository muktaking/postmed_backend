import { BaseEntity, Timestamp } from "typeorm";
export declare enum RolePermitted {
    guest = 0,
    student = 1,
    mentor = 2,
    moderator = 3,
    coordinator = 4,
    admin = 5
}
export declare enum Gender {
    male = "male",
    female = "female"
}
export declare class User extends BaseEntity {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string;
    password: string;
    email: string;
    gender: Gender;
    role: RolePermitted;
    createdAt: Timestamp;
    resetToken: string;
    resetTokenExpiration: Timestamp;
}
