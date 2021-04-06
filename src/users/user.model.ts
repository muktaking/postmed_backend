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

export enum RolePermitted {
  guest = 0,
  student = 1,
  mentor = 2,
  moderator = 3,
  coordinator = 4,
  admin = 5
}
export enum Gender {
    male = 'male',
    female = 'female'
}

export const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 15 },
  lastName: { type: String, required: false, maxlength: 15 },
  userName: { type: String, required: true, maxlength: 15 },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String,enum: ['male','female'] ,required: true },
  createdAt: {type: Date, default: Date.now()},
  role: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true, default: 1 }
});
