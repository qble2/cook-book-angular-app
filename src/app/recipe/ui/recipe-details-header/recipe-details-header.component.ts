import { Component, EventEmitter, Input, Output } from "@angular/core";
import { catchError } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { NavigationService } from "src/app/_service/navigation.service";
import { SnackBarService } from "src/app/_service/snack-bar.service";
import { Recipe } from "../../model/recipe.model";
import { RecipeService } from "../../service/recipe.service";

@Component({
  selector: "app-recipe-details-header",
  templateUrl: "./recipe-details-header.component.html",
  styleUrls: ["./recipe-details-header.component.scss"],
})
export class RecipeDetailsHeaderComponent {
  @Input() recipe: Recipe | undefined;
  @Input() isEditMode: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isFavorited: boolean = false;

  @Output() saveRecipeEvent = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public navigationService: NavigationService,
    public recipeService: RecipeService,
    public snackBarService: SnackBarService
  ) {}

  addRecipeToFavorites(): void {
    if (this.recipe?.id) {
      this.recipeService
        .addRecipeToFavorites(this.recipe.id)
        .pipe(
          catchError((serverResponseError: ServerResponseError) =>
            this.snackBarService.handleServerResponseError(serverResponseError)
          )
        )
        .subscribe();
    }
  }

  removeRecipeFromFavorites(): void {
    if (this.recipe?.id) {
      this.recipeService
        .removeRecipeFromFavorites(this.recipe.id)
        .pipe(
          catchError((serverResponseError: ServerResponseError) =>
            this.snackBarService.handleServerResponseError(serverResponseError)
          )
        )
        .subscribe();
    }
  }

  saveRecipe(): void {
    this.saveRecipeEvent.emit();
  }
}
