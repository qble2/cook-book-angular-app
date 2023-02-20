import { Recipe } from "src/app/recipe/model/recipe.model";
import { Review } from "src/app/recipe/model/review.model";
import { Role } from "./role.model";

// cannot extends LoggedInUser interface because some properties can be and has to stay undefined here (such as id) to be used in reactive forms
// TODO BKE create different models? CreateUserRequest, CreateUserResponse?
export interface User {
  id?: string; // UUID
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  roles?: Role[];
  recipes?: Recipe[];
  reviews?: Review[];

  _links?: any[];
}
