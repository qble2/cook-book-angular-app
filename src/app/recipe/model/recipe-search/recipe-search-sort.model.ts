import { RecipeSearchSortDirection } from "./recipe-search-sort-direction.enum";
import { RecipeSearchSortKey } from "./recipe-search-sort-key.enum";

export class RecipeSearchSort {
  key?: RecipeSearchSortKey;
  direction?: RecipeSearchSortDirection;

  constructor(key: RecipeSearchSortKey, direction: RecipeSearchSortDirection) {
    this.key = key;
    this.direction = direction;
  }
}
