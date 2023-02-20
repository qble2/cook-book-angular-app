import { RecipeSearchFilter } from "./recipe-search-filter.model";
import { RecipeSearchSort } from "./recipe-search-sort.model";

export class RecipeSearch {
  userId?: string; // UUID
  filters: RecipeSearchFilter[] = [];
  sort?: RecipeSearchSort;
}
