import { Recipe } from "./recipe.model";

export class RecipesPage {
  recipes?: Recipe[];
  currentPage?: number; // paginator.pageIndex
  totalPages?: number;
  totalElements?: number; // paginator.length
}
