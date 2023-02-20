import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { catchError, EMPTY } from "rxjs";
import { Recipe } from "src/app/recipe/model/recipe.model";
import { Ingredient } from "src/app/_model/ingredient.model";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { RecipeStepperComponent } from "../recipe-stepper.page";

@Component({
  selector: "app-update-recipe-stepper",
  templateUrl: "../recipe-stepper.page.html",
  styleUrls: ["../recipe-stepper.page.scss"],
})
export class EditRecipeStepperComponent
  extends RecipeStepperComponent
  implements OnInit
{
  override headerTitle = "Edit recipe";
  override submitFormButtonText = "Update";

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const recipeIdParam = params["recipeId"];
      if (recipeIdParam) {
        this.recipeService.getRecipe(recipeIdParam).subscribe((response) => {
          this.syncFormControls(response);
        });
      }
    });
  }

  syncFormControls(recipe: Recipe): void {
    this.propertiesForm.patchValue({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      servings: recipe.servings,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      tags: recipe.tags,
    });

    recipe.ingredients.forEach((ingredient) => {
      this.ingredientsFormArray.push(
        new FormControl<Ingredient | null>(ingredient)
      );
    });

    recipe.instructions.forEach((instruction) => {
      this.instructionsFormArray.push(
        new FormControl<string | null>(instruction)
      );
    });
  }

  override submit() {
    console.log("form.valid", this.recipeForm.valid);
    if (this.recipeForm.valid) {
      console.log("form.value", this.recipeForm.value);

      this.recipeService
        .updateRecipe(this.createRecipeObjectFromForm())
        .pipe(
          catchError((serverResponseError: ServerResponseError) => {
            this.serverResponseError = serverResponseError;
            return EMPTY;
          })
        )
        .subscribe((response) => {
          console.log("updateFullRecipe", response);
          this.navigationService.navigateToRecipeDetails(response);
        });
    }
  }

  // stepper.reset() does not do the job
  override resetStepper(): void {
    this.recipeForm.reset({
      // keeping recipe.id since its needed by the REST API to update the recipe
      formArray: [
        {
          id: this.propertiesForm.controls["id"].value,
        },
      ],
    });

    /**
     * Resetting formArrays size
     * Calling reset on FormControl, FormGroup or FormArray will only reset the values of native html controls they are attached to. It won't delete the controls from the DOM.
     */
    this.ingredientsFormArray.clear();
    this.instructionsFormArray.clear();
  }
}
