import { RecipeTagEnum } from "./recipe-tag.enum";

export interface UpdatePartialRecipe {
  description: string | null;
  servings: number | null;
  preparationTime: number | null;
  cookingTime: number | null;
  tags: RecipeTagEnum[] | null;
}
