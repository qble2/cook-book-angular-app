import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { Ingredient } from "src/app/_model/ingredient.model";
import { AppInitService } from "src/app/_service/app-init.service";

@Component({
  selector: "app-ingredient-autocomplete-form-field",
  templateUrl: "./ingredient-autocomplete-form-field.component.html",
  styleUrls: ["./ingredient-autocomplete-form-field.component.scss"],
})
export class IngredientAutocompleteFormFieldComponent implements OnChanges {
  @Input() parentFormControl: FormControl = new FormControl<Ingredient | null>(
    null
  );
  @Input() isRequired: boolean = false;
  @Input() excludedIngredients: (Ingredient | null)[] = [];

  @Output() ingredientSelectedEvent = new EventEmitter<Ingredient>();

  availableIngredients: Ingredient[] = [];
  availableUnitOfMeasures: string[] = [];

  filteredAvailableIngredients$?: Observable<Ingredient[]>;

  constructor(private appInitService: AppInitService) {
    this.availableUnitOfMeasures =
      this.appInitService.getAvailableUnitOfMeasures();
    this.availableIngredients = this.appInitService.getAvailableIngredients();
  }

  ngOnChanges(): void {
    // due to the additional filtering we are doing to hide already selected options,
    // this observable has to be updated when the @Input(excludedIngredients) has changed, to avoid desync
    if (this.availableIngredients) {
      this.filteredAvailableIngredients$ =
        this.parentFormControl.valueChanges.pipe(
          startWith(""),
          map((value) => {
            const name = typeof value === "string" ? value : value?.name;
            return name
              ? this._filter(name as string)
              : // : this.availableIngredients.slice();
                this.availableIngredients.filter(
                  (availableIngredient) =>
                    !this.excludedIngredients.some(
                      (i) => i?.id === availableIngredient.id
                    )
                );
          })
        );
    }
  }

  private _filter(value: string): Ingredient[] {
    const filterValue = value.toLowerCase();

    return this.availableIngredients.filter(
      (availableIngredient) =>
        availableIngredient.name &&
        !this.excludedIngredients.some(
          (i) => i?.id === availableIngredient.id
        ) &&
        availableIngredient.name.toLowerCase().includes(filterValue)
    );
  }

  displayIngredientOptionFn(ingredient: Ingredient): string {
    return ingredient && ingredient.name ? ingredient.name : "";
  }

  // handles adding an ingredient from the select drop-down list
  onIngredientOptionSelected(ingredient: Ingredient): void {
    this.ingredientSelectedEvent.emit(ingredient);
  }
}
