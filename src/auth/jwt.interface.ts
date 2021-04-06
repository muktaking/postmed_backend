import { RolePermitted } from "src/users/user.model";

export interface jwtPayload {
  email: string;
  id: string;
  role: RolePermitted;
}
