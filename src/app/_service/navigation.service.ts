import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Recipe } from "../recipe/model/recipe.model";
import { RecipeService } from "../recipe/service/recipe.service";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  public navigateToRoute(command: string) {
    console.log("redirecting user to", command);
    this.router.navigate([command]);
  }

  public navigateToError(): void {
    this.navigateToRoute("/error");
  }

  public navigateToHome(): void {
    this.navigateToRoute("/");
  }

  public navigateToLogin(): void {
    this.navigateToRoute("/login");
  }

  public navigateToSignup(): void {
    this.navigateToRoute("/signup");
  }

  public navigateToRecipeDetails(recipe: Recipe): void {
    this.navigateToRoute(`/recipes/${recipe.id}`);
  }

  public navigateToRecipeDetailsEdit(recipe: Recipe): void {
    this.navigateToRoute(`/recipes/${recipe.id}/edit`);
  }

  public navigateToCreateRecipeStepper(): void {
    this.navigateToRoute("/recipes/create-stepper");
  }

  public navigateToEditRecipeStepper(recipe: Recipe): void {
    this.navigateToRoute(`/recipes/${recipe.id}/edit-stepper`);
  }
}
