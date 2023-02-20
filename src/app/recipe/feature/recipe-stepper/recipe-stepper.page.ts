import { Component } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Ingredient } from "src/app/_model/ingredient.model";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { AppInitService } from "src/app/_service/app-init.service";
import { LoadingService } from "src/app/_service/loading.service";
import { NavigationService } from "src/app/_service/navigation.service";
import { RecipeTagEnum } from "../../model/recipe-tag.enum";
import { Recipe } from "../../model/recipe.model";
import { RecipeService } from "../../service/recipe.service";

// TODO BKE make this an abstract class
@Component({
  // selector: "app-recipe-stepper",
  templateUrl: "./recipe-stepper.page.html",
  styleUrls: ["./recipe-stepper.page.scss"],
})
export class RecipeStepperComponent {
  headerTitle: string = "Recipe (stepper)";
  submitFormButtonText: string = "Confirm";

  availableTags: RecipeTagEnum[] = [];
  recipeForm: FormGroup;
  newInstructionFormControl: FormControl<string | null>;

  serverResponseError?: ServerResponseError;

  constructor(
    public loadingService: LoadingService,
    protected appInitService: AppInitService,
    protected navigationService: NavigationService,
    protected recipeService: RecipeService,
    protected formBuilder: FormBuilder,
    protected route: ActivatedRoute
  ) {
    this.availableTags = this.appInitService.getAvailableTags();

    this.recipeForm = new FormGroup({
      formArray: new FormArray([
        new FormGroup({
          id: new FormControl<number | null>(null),
          name: new FormControl<string | null>(null, {
            validators: Validators.required,
          }),
          description: new FormControl<string | null>(null),
          servings: new FormControl<number | null>(null, {
            validators: Validators.required,
          }),
          preparationTime: new FormControl<number | null>(null),
          cookingTime: new FormControl<number | null>(null),
          tags: new FormControl<RecipeTagEnum[]>([], {
            validators: Validators.required,
            nonNullable: true, // needed
          }),
        }),
        new FormArray<FormControl<Ingredient | null>>([], {
          validators: Validators.required,
        }),
        new FormArray<FormControl<string | null>>([], {
          validators: Validators.required,
        }),
      ]),
    });

    this.newInstructionFormControl = new FormControl<string | null>(null, {
      validators: Validators.required,
    });
  }

  get formArray(): AbstractControl | null {
    return this.recipeForm.get("formArray");
  }

  get propertiesForm(): FormGroup {
    return this.formArray?.get([0]) as FormGroup;
  }

  get tagsFormControl(): FormControl {
    return this.propertiesForm.controls["tags"] as FormControl;
  }

  get ingredientsFormArray(): FormArray {
    return this.formArray?.get([1]) as FormArray;
  }

  get instructionsFormArray(): FormArray {
    return this.formArray?.get([2]) as FormArray;
  }

  stepChanged(event: any, stepper: any) {
    event.selectedStep.interacted = false; // needed
    this.newInstructionFormControl.markAsUntouched(); // needed
  }

  onIngredientAddedEvent(ingredient: Ingredient): void {
    if (
      !this.ingredientsFormArray.value.some(
        (i: Ingredient) => i.id === ingredient.id
      )
    ) {
      this.ingredientsFormArray.push(
        new FormControl<Ingredient | null>(ingredient)
      );
    }
  }

  onIngredientRemovedEvent(ingredient: Ingredient, i: number): void {
    // this.filteredRecipeIngredients = this.filteredRecipeIngredients.filter(
    //   (i) => i.id !== ingredient.id
    // );
    this.ingredientsFormArray.removeAt(i);
  }

  addInstruction(instruction: string): void {
    this.instructionsFormArray.push(
      new FormControl<string | null>(instruction)
    );
    this.newInstructionFormControl.reset();
  }

  removeInstruction(i: number): void {
    this.instructionsFormArray.removeAt(i);
  }

  submit(): void {}
  // abstract submit(): void;

  createRecipeObjectFromForm(): Recipe {
    const recipe: Recipe = this.propertiesForm.getRawValue();
    recipe.ingredients = this.ingredientsFormArray.getRawValue();
    recipe.instructions = this.instructionsFormArray.getRawValue();
    console.log("Recipe", recipe);

    return recipe;
  }

  // stepper.reset() does not do the job
  resetStepper(): void {}
  // abstract resetStepper(): void;
}
