import { Tokens } from "./tokens.model";
import { User } from "./user.model";

export class LoginResponse {
  tokens!: Tokens;
  user!: User;
}
