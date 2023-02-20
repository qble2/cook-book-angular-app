import { Component } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/service/auth.service";
import { LoadingService } from "src/app/_service/loading.service";
import { NavigationService } from "src/app/_service/navigation.service";
import { SessionStorageService } from "src/app/_service/session-storage.service";
import { RecipeSearch } from "../../model/recipe-search/recipe-search.model";
import { Recipe } from "../../model/recipe.model";
import { RecipesPage } from "../../model/recipes-page.model";
import { RecipeService } from "../../service/recipe.service";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.page.html",
  styleUrls: ["./recipe-list.page.scss"],
})
export class RecipeListComponent {
  isHeaderDrawerExpanded: boolean = false;

  recipesPage?: RecipesPage;

  pageEvent?: PageEvent;

  recipeSearch: RecipeSearch = new RecipeSearch();
  selectedRecipe?: Recipe;

  constructor(
    public loadingService: LoadingService,
    public authService: AuthService,
    public navigationService: NavigationService,
    private sessionStorageServiceService: SessionStorageService,
    private recipeService: RecipeService
  ) {}

  selectRecipe(recipe: Recipe): void {
    if (this.isSelectedRecipe(recipe)) {
      this.selectedRecipe = undefined;
    } else {
      this.selectedRecipe = recipe;
    }
  }

  isSelectedRecipe(recipe: Recipe): boolean {
    return recipe === this.selectedRecipe;
  }

  // single entry to reload recipes
  onRecipeFiltersChangedEvent(recipeSearch: RecipeSearch): void {
    this.recipeSearch = recipeSearch;
    this.reloadRecipes();
    this.isHeaderDrawerExpanded = false;
  }

  // XXX BKE pageEvent is being reset every view init
  reloadRecipes(page?: number, size?: number): void {
    this.recipeService
      .getRecipes(this.recipeSearch, page, size)
      .subscribe((response) => {
        this.recipesPage = response;
      });
  }

  onPageEvent(pageEvent: PageEvent): void {
    this.pageEvent = pageEvent;
    this.reloadRecipes(pageEvent.pageIndex, pageEvent.pageSize);
  }
}
