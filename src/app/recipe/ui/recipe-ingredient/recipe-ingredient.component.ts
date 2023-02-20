import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Ingredient } from "src/app/_model/ingredient.model";
import { UnitOfMeasure } from "src/app/_model/unit-of-measure.enum";
import { AppInitService } from "src/app/_service/app-init.service";

interface IngredientForm {
  quantity: FormControl<number | null>;
  unitOfMeasure: FormControl<UnitOfMeasure | null>;
}

@Component({
  selector: "app-recipe-ingredient",
  templateUrl: "./recipe-ingredient.component.html",
  styleUrls: ["./recipe-ingredient.component.scss"],
})
export class RecipeIngredientComponent implements OnInit, OnChanges {
  @Input() ingredient: Ingredient = <Ingredient>{};
  @Input() isEditMode: boolean = false;
  @Input() isMonitorChanges: boolean = false;
  @Input() isRemovable: boolean = false;

  @Output() ingredientRemovedEvent = new EventEmitter<Ingredient>();
  @Output() ingredientModifiedEvent = new EventEmitter<Ingredient>();

  ingredientForm: FormGroup<IngredientForm>;

  availableUnitOfMeasures: string[] = [];
  isIngredientModified: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private appInitService: AppInitService
  ) {
    this.ingredientForm = new FormGroup<IngredientForm>({
      quantity: new FormControl<number | null>(null, {
        validators: Validators.required,
      }),
      unitOfMeasure: new FormControl<UnitOfMeasure | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  ngOnChanges(): void {
    if (this.isEditMode) {
      // emitEvent: false, because by default, enable/disable form control fires valueChanges
      this.ingredientForm.enable({ emitEvent: false });
    } else {
      // emitEvent: false, because by default enable/disable form control fires valueChanges
      this.ingredientForm.disable({ emitEvent: false });
    }
  }

  ngOnInit(): void {
    this.availableUnitOfMeasures =
      this.appInitService.getAvailableUnitOfMeasures();

    this.ingredientForm.patchValue({
      quantity: this.ingredient.quantity,
      unitOfMeasure: this.ingredient.unitOfMeasure,
    });

    this.ingredientForm.valueChanges.subscribe((value) => {
      this.onFormValueChange(value);
    });
  }

  updateIngredient(ingredient: Ingredient): void {
    this.ingredientModifiedEvent.emit(ingredient);
    this.isIngredientModified = false;
  }

  removeIngredient(ingredient: Ingredient): void {
    this.ingredientRemovedEvent.emit(ingredient);
  }

  onFormValueChange(value: any): void {
    if (this.ingredientForm.enabled) {
      this.isIngredientModified = true;
    }

    if (this.ingredientForm.valid) {
      this.ingredient.quantity =
        this.ingredientForm.controls["quantity"]?.value;
      this.ingredient.unitOfMeasure =
        this.ingredientForm.controls["unitOfMeasure"]?.value;
    }
  }
}
