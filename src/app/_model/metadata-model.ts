import { RecipeTagEnum } from "../recipe/model/recipe-tag.enum";
import { Ingredient } from "./ingredient.model";

export class Metadata {
  availableTags: RecipeTagEnum[] = [];
  availableUnitOfMeasures: string[] = [];
  availableIngredients: Ingredient[] = [];
}
