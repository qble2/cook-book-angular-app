import { Component } from "@angular/core";
import { catchError, EMPTY } from "rxjs";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { RecipeStepperComponent } from "../recipe-stepper.page";

@Component({
  selector: "app-create-recipe-stepper",
  templateUrl: "../recipe-stepper.page.html",
  styleUrls: ["../recipe-stepper.page.scss"],
})
export class CreateRecipeStepperComponent extends RecipeStepperComponent {
  override headerTitle: string = "Create recipe";
  override submitFormButtonText: string = "Create";

  override submit() {
    console.log("form.valid", this.recipeForm.valid);
    if (this.recipeForm.valid) {
      console.log("form.value", this.recipeForm.value);

      this.recipeService
        .createRecipe(this.createRecipeObjectFromForm())
        .pipe(
          catchError((serverResponseError: ServerResponseError) => {
            this.serverResponseError = serverResponseError;
            return EMPTY;
          })
        )
        .subscribe((response) => {
          console.log("createRecipe", response);
          this.navigationService.navigateToRecipeDetails(response);
        });
    }
  }

  // stepper.reset() does not do the job
  override resetStepper(): void {
    this.recipeForm.reset();

    /**
     * Resetting formArrays size
     * Calling reset on FormControl, FormGroup or FormArray will only reset the values of native html controls they are attached to. It won't delete the controls from the DOM.
     */
    this.ingredientsFormArray.clear();
    this.instructionsFormArray.clear();
  }
}
