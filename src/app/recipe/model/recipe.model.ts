import { User } from "src/app/auth/model/user.model";
import { Ingredient } from "src/app/_model/ingredient.model";
import { RecipeTagEnum } from "./recipe-tag.enum";
import { Review } from "./review.model";

export class Recipe {
  id?: string; // UUID
  name?: string;
  description?: string;
  servings?: number;
  preparationTime?: number;
  cookingTime?: number;

  createdAt?: Date;
  editedAt?: Date;

  author?: User;

  tags: RecipeTagEnum[] = [];
  ingredients: Ingredient[] = [];
  instructions: string[] = [];
  reviews: Review[] = [];
  // pictures?: byte[];

  _links?: any[];

  // TODO BKE
  thumbnail?: any;

  // Experimental
  averageRating?: number;
}
