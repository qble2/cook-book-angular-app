import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";
import { Ingredient } from "src/app/_model/ingredient.model";
import { environment } from "src/environments/environment";
import { RecipeSearch } from "../model/recipe-search/recipe-search.model";
import { RecipeTagEnum } from "../model/recipe-tag.enum";
import { Recipe } from "../model/recipe.model";
import { RecipesPage } from "../model/recipes-page.model";
import { UpdatePartialRecipe } from "../model/update-recipe.model";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public isLoggedInRecipeAuthor(recipe: Recipe): boolean {
    return (
      this.authService.isLoggedIn() &&
      this.authService.getLoggedInUser()?.id === recipe.author?.id
    );
  }

  public getRecipes(
    recipeSearch: RecipeSearch,
    page?: number,
    size?: number
  ): Observable<RecipesPage> {
    const options =
      page !== undefined && size !== undefined
        ? { params: new HttpParams().set("page", page).set("size", size) }
        : {};

    return this.http.post<any>(
      `${environment.apiBaseUrl}/api/recipes/search`,
      recipeSearch || {},
      options
    );
  }

  public getUserRecipes(userId: string, page?: number, size?: number) {
    const options =
      page !== undefined && size !== undefined
        ? { params: new HttpParams().set("page", page).set("size", size) }
        : {};

    return this.http.get<any>(
      `${environment.apiBaseUrl}/api/recipes/users/${userId}`,
      options
    );
  }

  public getRecipe(recipeId: string): Observable<Recipe> {
    return this.http.get<any>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}`
    );
  }

  public createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(
      `${environment.apiBaseUrl}/api/recipes`,
      recipe
    );
  }

  public updateRecipe(recipe: Recipe) {
    return this.http.put<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipe.id}`,
      recipe
    );
  }

  public getRecipeTags(recipeId: string): Observable<RecipeTagEnum[]> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/api/recipes/${recipeId}/tags`)
      .pipe(map((data) => (data._embedded ? data._embedded.stringList : [])));
  }

  public getRecipeIngredients(recipeId: string): Observable<Ingredient[]> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/api/recipes/${recipeId}/ingredients`)
      .pipe(map((data) => (data._embedded ? data._embedded.ingredients : [])));
  }

  public getRecipeInstructions(recipeId: string): Observable<string[]> {
    return this.http
      .get<any>(
        `${environment.apiBaseUrl}/api/recipes/${recipeId}/instructions`
      )
      .pipe(map((data) => (data._embedded ? data._embedded.stringList : [])));
  }

  public updateRecipeTags(
    recipeId: string,
    tags: string[]
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/tags`,
      tags
    );
  }

  public addRecipeIngredient(
    recipeId: string,
    ingredient: Ingredient
  ): Observable<Recipe> {
    return this.http.post<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/ingredients`,
      ingredient
    );
  }

  public updateRecipeIngredient(
    recipeId: string,
    ingredient: Ingredient
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/ingredients/${ingredient.id}`,
      ingredient
    );
  }

  public removeRecipeIngredient(
    recipeId: string,
    ingredient: Ingredient
  ): Observable<Recipe> {
    return this.http.delete<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/ingredients/${ingredient.id}`
    );
  }

  public updateRecipeInstructions(
    recipeId: string,
    instructions: string[]
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/instructions`,
      instructions
    );
  }

  public getUserFavoriteRecipes(userId: string, page?: number, size?: number) {
    const options =
      page !== undefined && size !== undefined
        ? { params: new HttpParams().set("page", page).set("size", size) }
        : {};

    return this.http.get<any>(
      `${environment.apiBaseUrl}/api/recipes/users/${userId}`,
      options
    );
  }

  public addRecipeToFavorites(recipeId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/favorites`,
      null
    );
  }

  public removeRecipeFromFavorites(recipeId: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/favorites`
    );
  }

  public updatePartialRecipe(
    recipeId: string,
    updatePartialRecipe: UpdatePartialRecipe
  ): Observable<Recipe> {
    return this.http.put<Recipe>(
      `${environment.apiBaseUrl}/api/recipes/${recipeId}/partial`,
      updatePartialRecipe
    );
  }
}
