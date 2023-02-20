import { User } from "src/app/auth/model/user.model";
import { Recipe } from "./recipe.model";

export interface Review {
  recipe?: Recipe;
  author?: User;

  reviewDate?: Date;

  rating: number | null;
  comment: string | null;

  _links?: any[];
}
