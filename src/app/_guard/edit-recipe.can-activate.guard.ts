import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { RecipeService } from "../recipe/service/recipe.service";
import { NavigationService } from "../_service/navigation.service";

@Injectable({
  providedIn: "root",
})
export class EditRecipeCanActivateGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
    private recipeService: RecipeService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const recipeId = route.paramMap.get("recipeId") as string | null;
    if (!recipeId) {
      return false;
    }

    return this.recipeService.getRecipe(recipeId).pipe(
      map((response) => {
        const isRecipeAuthor: boolean =
          this.recipeService.isLoggedInRecipeAuthor(response);
        if (!isRecipeAuthor) {
          this.navigationService.navigateToHome();
        }
        return isRecipeAuthor;
      }),
      catchError((error) => {
        this.navigationService.navigateToHome();
        return of(false);
      })
    );
  }
}
