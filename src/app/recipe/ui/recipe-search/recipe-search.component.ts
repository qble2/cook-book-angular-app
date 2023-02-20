import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/auth/service/auth.service";
import { Ingredient } from "src/app/_model/ingredient.model";
import { AppInitService } from "src/app/_service/app-init.service";
import { LoadingService } from "src/app/_service/loading.service";
import { SessionStorageService } from "src/app/_service/session-storage.service";
import { RecipeSearchFilterKey } from "../../model/recipe-search/recipe-search-filter-key.enum";
import { RecipeSearchFilterOperator } from "../../model/recipe-search/recipe-search-filter-operator.enum";
import { RecipeSearchFilter } from "../../model/recipe-search/recipe-search-filter.model";
import { RecipeSearch } from "../../model/recipe-search/recipe-search.model";
import { RecipeTagEnum } from "../../model/recipe-tag.enum";

const RECIPE_SEARCH_SESSION_STORAGE_KEY = "recipe_search";

interface RecipeSearchForm {
  isUserFavoriteRecipes: FormControl<boolean | null>;
  isUserRecipes: FormControl<boolean | null>;
  author: FormControl<string | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  minimumServings: FormControl<number | null>;
  maximumPreparationTime: FormControl<number | null>;
  maximumCookingTime: FormControl<number | null>;
  averageRating: FormControl<number | null>;
  tags: FormArray<FormControl<boolean | null>>;
  ingredients: FormArray<FormControl<Ingredient | null>>;
}

@Component({
  selector: "app-recipe-search",
  templateUrl: "./recipe-search.component.html",
  styleUrls: ["./recipe-search.component.scss"],
})
export class RecipeSearchComponent implements OnInit {
  @Output() recipesFiltersChangedEvent = new EventEmitter<RecipeSearch>();

  recipeSearchForm: FormGroup<RecipeSearchForm>;
  ingredientAutocompleteFormControl: FormControl<Ingredient | null>;

  availableTags: RecipeTagEnum[] = [];
  availableIngredients: Ingredient[] = [];

  constructor(
    public loadingService: LoadingService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private sessionStorageServiceService: SessionStorageService,
    private appInitService: AppInitService
  ) {
    this.availableTags = this.appInitService.getAvailableTags();
    this.availableIngredients = this.appInitService.getAvailableIngredients();

    this.recipeSearchForm = new FormGroup<RecipeSearchForm>({
      isUserFavoriteRecipes: new FormControl<boolean | null>(false),
      isUserRecipes: new FormControl<boolean | null>(false),
      author: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
      description: new FormControl<string | null>(null),
      minimumServings: new FormControl<number | null>(null),
      maximumPreparationTime: new FormControl<number | null>(null),
      maximumCookingTime: new FormControl<number | null>(null),
      averageRating: new FormControl<number | null>(null),
      // tags: this.formBuilder.array([]),
      // ingredients: this.formBuilder.array([]),
      tags: new FormArray<FormControl<boolean | null>>([]),
      ingredients: new FormArray<FormControl<Ingredient | null>>([]),
    });

    this.ingredientAutocompleteFormControl = new FormControl<Ingredient | null>(
      null
    );

    this.availableTags.forEach(() => {
      this.tagsFormArray.push(new FormControl<boolean | null>(false));
    });
  }

  get tagsFormArray(): FormArray {
    return this.recipeSearchForm.controls["tags"] as FormArray;
  }

  get ingredientsFormArray(): FormArray {
    return this.recipeSearchForm.controls["ingredients"] as FormArray;
  }

  ngOnInit(): void {
    this.loadSearchRecipeFromSessionStorage();
  }

  private loadSearchRecipeFromSessionStorage(): void {
    console.log("loading recipeSearch from session storage");
    const recipeSearchLoadedFromSessionStorage: RecipeSearch =
      this.sessionStorageServiceService.getObject(
        RECIPE_SEARCH_SESSION_STORAGE_KEY
      );

    if (recipeSearchLoadedFromSessionStorage) {
      recipeSearchLoadedFromSessionStorage.filters?.forEach((filter) => {
        switch (filter.key) {
          case RecipeSearchFilterKey.USER_RECIPES:
            this.recipeSearchForm.controls["isUserRecipes"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.FAVORITE_RECIPES:
            this.recipeSearchForm.controls["isUserFavoriteRecipes"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.RECIPE_AUTHOR:
            this.recipeSearchForm.controls["author"].patchValue(filter.value, {
              emitEvent: false,
            });
            break;
          case RecipeSearchFilterKey.RECIPE_TAGS:
            this.availableTags.forEach((tag, index) => {
              if (filter.values?.includes(tag)) {
                this.tagsFormArray
                  .at(index)
                  ?.patchValue(true, { emitEvent: false });
              }
            });
            break;
          case RecipeSearchFilterKey.RECIPE_NAME:
            this.recipeSearchForm.controls["name"].patchValue(filter.value, {
              emitEvent: false,
            });
            break;
          case RecipeSearchFilterKey.RECIPE_DESCRIPTION:
            this.recipeSearchForm.controls["description"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.RECIPE_SERVINGS:
            this.recipeSearchForm.controls["minimumServings"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.RECIPE_PREPARATION_TIME:
            this.recipeSearchForm.controls["maximumPreparationTime"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.RECIPE_COOKING_TIME:
            this.recipeSearchForm.controls["maximumCookingTime"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          case RecipeSearchFilterKey.RECIPE_INGREDIENTS:
            this.availableIngredients
              .filter((ingredient: Ingredient) =>
                filter.values?.includes(ingredient.id)
              )
              .forEach((ingredient) => {
                this.ingredientsFormArray.push(
                  new FormControl<Ingredient | null>(ingredient)
                );
              });
            break;
          case RecipeSearchFilterKey.RECIPE_AVERAGE_RATING:
            this.recipeSearchForm.controls["averageRating"].patchValue(
              filter.value,
              {
                emitEvent: false,
              }
            );
            break;
          // default:
          //   break;
        }
      });

      // before using the following code, we need to implement a subscription to the logout event to re-enable the author formControl on logout
      // this.recipeSearchForm.controls["isUserRecipes"].valueChanges.subscribe(
      //   (value) => {
      //     if (value) {
      //       this.recipeSearchForm.controls["author"].disable();
      //     } else {
      //       this.recipeSearchForm.controls["author"].enable();
      //     }
      //   }
      // );
    }

    // responsible for reloading recipes . always emit, even when no filters set/saved
    this.recipesFiltersChangedEvent.emit(recipeSearchLoadedFromSessionStorage);
  }

  private saveSearchRecipeIntoSessionStorage(recipeSearch: RecipeSearch): void {
    console.log("saving recipeSearch into session storage", recipeSearch);
    // const filledFormControls = Object.fromEntries(
    //   Object.entries(this.recipeSearchForm.value).filter(
    //     ([_, v]) => v != null && v != "" && (v as []).length > 0
    //   )
    // );
    this.sessionStorageServiceService.saveObject(
      RECIPE_SEARCH_SESSION_STORAGE_KEY,
      recipeSearch
    );
  }

  resetSearchRecipeForm(): void {
    this.recipeSearchForm.reset();

    // resetting parent form is not enough to clear the formArray, it will still hold controls with null values
    this.ingredientsFormArray.clear({
      emitEvent: false,
    });
  }

  submitRecipeSearchForm(): void {
    const recipeSearch: RecipeSearch = new RecipeSearch();

    const selectedIngredients = this.ingredientsFormArray?.value;
    if (selectedIngredients && selectedIngredients.length > 0) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_INGREDIENTS,
          RecipeSearchFilterOperator.ALL,
          undefined,
          selectedIngredients.map((ingredient: Ingredient) => ingredient.id)
        )
      );
    }

    if (this.authService.isLoggedIn()) {
      recipeSearch.userId = this.authService.getLoggedInUser()?.id;

      if (this.recipeSearchForm.controls["isUserRecipes"]?.value) {
        recipeSearch.filters.push(
          new RecipeSearchFilter(
            RecipeSearchFilterKey.USER_RECIPES,
            RecipeSearchFilterOperator.EQUAL,
            this.recipeSearchForm.controls["isUserRecipes"]?.value,
            undefined
          )
        );
      }
      if (this.recipeSearchForm.controls["isUserFavoriteRecipes"]?.value) {
        recipeSearch.filters.push(
          new RecipeSearchFilter(
            RecipeSearchFilterKey.FAVORITE_RECIPES,
            RecipeSearchFilterOperator.EQUAL,
            this.recipeSearchForm.controls["isUserFavoriteRecipes"]?.value,
            undefined
          )
        );
      }
    }
    const selectedTags = this.tagsFormArray.value
      .map((checked: boolean, i: number) =>
        checked ? this.availableTags[i] : null
      )
      .filter((v: any) => v !== null);
    if (selectedTags && selectedTags.length > 0) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_TAGS,
          RecipeSearchFilterOperator.ALL,
          undefined,
          // this.recipeSearchForm.controls["tags"]?.value
          selectedTags
        )
      );
    }
    if (this.recipeSearchForm.controls["author"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_AUTHOR,
          RecipeSearchFilterOperator.LIKE,
          this.recipeSearchForm.controls["author"]?.value
        )
      );
    }
    if (this.recipeSearchForm.controls["name"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_NAME,
          RecipeSearchFilterOperator.LIKE,
          this.recipeSearchForm.controls["name"]?.value,
          undefined
        )
      );
    }
    if (this.recipeSearchForm.controls["description"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_DESCRIPTION,
          RecipeSearchFilterOperator.LIKE,
          this.recipeSearchForm.controls["description"]?.value,
          undefined
        )
      );
    }
    if (this.recipeSearchForm.controls["minimumServings"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_SERVINGS,
          RecipeSearchFilterOperator.GTE,
          this.recipeSearchForm.controls["minimumServings"]?.value,
          undefined
        )
      );
    }
    if (this.recipeSearchForm.controls["maximumPreparationTime"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_PREPARATION_TIME,
          RecipeSearchFilterOperator.LTE,
          this.recipeSearchForm.controls["maximumPreparationTime"]?.value,
          undefined
        )
      );
    }
    if (this.recipeSearchForm.controls["maximumCookingTime"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_COOKING_TIME,
          RecipeSearchFilterOperator.LTE,
          this.recipeSearchForm.controls["maximumCookingTime"]?.value,
          undefined
        )
      );
    }
    if (this.recipeSearchForm.controls["averageRating"]?.value) {
      recipeSearch.filters.push(
        new RecipeSearchFilter(
          RecipeSearchFilterKey.RECIPE_AVERAGE_RATING,
          RecipeSearchFilterOperator.GTE,
          this.recipeSearchForm.controls["averageRating"]?.value,
          undefined
        )
      );
    }

    // TODO BKE
    // recipeSearch.sort = new RecipeSearchSort(
    //   RecipeSearchSortKey.RECIPE_NAME,
    //   RecipeSearchSortDirection.DESC
    // );

    //
    this.saveSearchRecipeIntoSessionStorage(recipeSearch);
    this.recipesFiltersChangedEvent.emit(recipeSearch);
  }

  onIngredientSelectedEvent(ingredient: Ingredient): void {
    if (
      !this.ingredientsFormArray.value.some(
        (i: Ingredient) => i.id === ingredient.id
      )
    ) {
      this.ingredientsFormArray.push(
        new FormControl<Ingredient | null>(ingredient)
      );
    }
    this.ingredientAutocompleteFormControl.reset();
  }

  onIngredientRemovedEvent(ingredient: Ingredient, i: number): void {
    // this.filteredRecipeIngredients = this.filteredRecipeIngredients.filter(
    //   (i) => i.id !== ingredient.id
    // );
    this.ingredientsFormArray.removeAt(i);
  }
}
