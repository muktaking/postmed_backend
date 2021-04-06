import { SetMetadata } from "@nestjs/common";
import { RolePermitted } from "./users/user.model";

export const Role = (...role: RolePermitted[]) => SetMetadata("role", role);
