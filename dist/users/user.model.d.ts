import * as mongoose from "mongoose";
export interface User extends mongoose.Document {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    email: string;
    gender: Gender;
    createdAt: Date;
    role: RolePermitted;
}
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
export declare const UserSchema: mongoose.Schema<any>;
