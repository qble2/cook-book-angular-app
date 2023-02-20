import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Ingredient } from "src/app/_model/ingredient.model";

@Component({
  selector: "app-recipe-search-ingredient-filter",
  templateUrl: "./recipe-search-ingredient-filter.component.html",
  styleUrls: ["./recipe-search-ingredient-filter.component.scss"],
})
export class RecipeSearchIngredientFilterComponent {
  @Input() ingredient: Ingredient = <Ingredient>{};

  @Output() ingredientRemovedEvent = new EventEmitter<Ingredient>();

  constructor() {}

  removeIngredient(ingredient: Ingredient): void {
    this.ingredientRemovedEvent.emit(ingredient);
  }
}
