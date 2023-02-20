import { RoleNameEnum } from "./role.enum";

export class Role {
  id?: string; // UUID
  name?: RoleNameEnum;

  _links?: any[];
}
