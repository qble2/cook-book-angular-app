import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { Ingredient } from "src/app/_model/ingredient.model";
import { UnitOfMeasure } from "src/app/_model/unit-of-measure.enum";
import { AppInitService } from "src/app/_service/app-init.service";
import { requireMatch } from "src/app/_validator/validators";

interface AddRecipeIngredientForm {
  ingredient: FormControl<Ingredient | null>;
  quantity: FormControl<number | null>;
  unitOfMeasure: FormControl<UnitOfMeasure | null>;
}

@Component({
  selector: "app-recipe-add-ingredient",
  templateUrl: "./recipe-add-ingredient.component.html",
  styleUrls: ["./recipe-add-ingredient.component.scss"],
})
export class RecipeAddIngredientComponent implements OnChanges {
  @Input() excludedIngredients: Ingredient[] = [];

  @Output() ingredientSelectedEvent = new EventEmitter<Ingredient>();
  @Output() ingredientAddedEvent = new EventEmitter<Ingredient>();

  newIngredientForm: FormGroup<AddRecipeIngredientForm>;

  availableIngredients: Ingredient[] = [];
  availableUnitOfMeasures: string[] = [];

  filteredAvailableIngredients$?: Observable<Ingredient[]>;

  constructor(
    private formBuilder: FormBuilder,
    private appInitService: AppInitService
  ) {
    this.availableUnitOfMeasures =
      this.appInitService.getAvailableUnitOfMeasures();
    this.availableIngredients = this.appInitService.getAvailableIngredients();

    this.newIngredientForm = new FormGroup<AddRecipeIngredientForm>({
      ingredient: new FormControl<Ingredient | null>(null, {
        validators: [Validators.required, requireMatch],
      }),
      quantity: new FormControl<number | null>(null, {
        validators: Validators.required,
      }),
      unitOfMeasure: new FormControl<UnitOfMeasure | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  ngOnChanges(): void {
    // due to the additional filtering we are doing to hide already selected options,
    // this observable has to be updated when the @Input(excludedIngredients) has changed, to avoid desync
    if (this.availableIngredients) {
      this.filteredAvailableIngredients$ = this.newIngredientForm.controls[
        "ingredient"
      ].valueChanges.pipe(
        startWith(""),
        map((value) => {
          const name = typeof value === "string" ? value : value?.name;
          return name
            ? this._filter(name as string)
            : // : this.availableIngredients.slice();
              this.availableIngredients.filter(
                (availableIngredient) =>
                  !this.excludedIngredients.some(
                    (i) => i.id === availableIngredient.id
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
          (i) => i.id === availableIngredient.id
        ) &&
        availableIngredient.name.toLowerCase().includes(filterValue)
    );
  }

  displayIngredientOptionFn(ingredient: Ingredient): string {
    return ingredient && ingredient.name ? ingredient.name : "";
  }

  // handles selecting an ingredient from the select drop-down list
  onIngredientSelectedEvent(ingredient: Ingredient): void {
    this.ingredientSelectedEvent.emit(ingredient);

    this.newIngredientForm.patchValue({
      unitOfMeasure: ingredient.defaultUnitOfMeasure,
    });
  }

  // handles adding a fully quantified ingredient through the form submit button
  addIngredient(): void {
    const newIngredient: Ingredient | null =
      this.newIngredientForm.controls["ingredient"].value;
    if (newIngredient) {
      newIngredient.quantity =
        this.newIngredientForm.controls["quantity"]?.value;
      newIngredient.unitOfMeasure =
        this.newIngredientForm.controls["unitOfMeasure"]?.value;

      this.ingredientAddedEvent.emit(newIngredient);
      this.newIngredientForm.controls["ingredient"].reset();
      this.newIngredientForm.reset();
    }
  }
}
