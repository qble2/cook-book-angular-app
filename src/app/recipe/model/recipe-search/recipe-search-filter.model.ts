import { RecipeSearchFilterKey } from "./recipe-search-filter-key.enum";
import { RecipeSearchFilterOperator } from "./recipe-search-filter-operator.enum";

export class RecipeSearchFilter {
  key?: RecipeSearchFilterKey;
  operator?: RecipeSearchFilterOperator;
  value?: any;
  values?: any[];

  constructor(
    key: RecipeSearchFilterKey,
    operator: RecipeSearchFilterOperator,
    value?: any,
    values?: any[]
  ) {
    this.key = key;
    this.operator = operator;
    this.value = value;
    this.values = values;
  }
}
