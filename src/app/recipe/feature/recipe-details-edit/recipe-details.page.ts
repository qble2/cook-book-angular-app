import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { finalize, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";
import { AppInitService } from "src/app/_service/app-init.service";
import { LoadingService } from "src/app/_service/loading.service";
import { NavigationService } from "src/app/_service/navigation.service";
import { Ingredient } from "../../../_model/ingredient.model";
import { DateUtils } from "../../../_utility/date-utils";
import { RecipeTagEnum } from "../../model/recipe-tag.enum";
import { Recipe } from "../../model/recipe.model";
import { RecipeService } from "../../service/recipe.service";

interface UpdateRecipeForm {
  description: FormControl<string | null>;
  servings: FormControl<number | null>;
  preparationTime: FormControl<number | null>;
  cookingTime: FormControl<number | null>;
  tags: FormControl<RecipeTagEnum[] | null>;
}

@Component({
  selector: "app-recipe-details",
  templateUrl: "./recipe-details-edit.page.html",
  styleUrls: ["./recipe-details-edit.page.scss"],
})
export class RecipeDetailsEditComponent implements OnInit, OnDestroy {
  updateRecipeForm: FormGroup<UpdateRecipeForm>;
  newInstructionFormControl: FormControl<string | null>;

  availableTags: RecipeTagEnum[] = [];

  routeSub?: Subscription;

  recipe: Recipe = new Recipe();

  isUnsubmittedFormChanges = false;

  timeElapsedSinceLastEditIntervalId: any;
  timeElapsedSinceLastEdit: string = "";

  constructor(
    public loadingService: LoadingService,
    public navigationService: NavigationService,
    public authService: AuthService,
    private appInitService: AppInitService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.availableTags = this.appInitService.getAvailableTags();

    this.updateRecipeForm = new FormGroup<UpdateRecipeForm>({
      description: new FormControl<string | null>(null),
      servings: new FormControl<number | null>(null),
      preparationTime: new FormControl<number | null>(null),
      cookingTime: new FormControl<number | null>(null),
      tags: new FormControl<RecipeTagEnum[] | null>([]),
    });

    this.newInstructionFormControl = new FormControl<string | null>(null, {
      validators: Validators.required,
    });
  }

  ngOnDestroy(): void {
    console.log(
      "ngOnDestroy . clearInterval . timeElapsedSinceLastEditIntervalId",
      this.timeElapsedSinceLastEditIntervalId
    );
    clearInterval(this.timeElapsedSinceLastEditIntervalId);
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const recipeIdParam: string = params["recipeId"];
      if (recipeIdParam) {
        this.recipeService
          .getRecipe(recipeIdParam)
          .pipe(
            finalize(() => {
              this.updateRecipeForm.valueChanges.subscribe(() => {
                this.isUnsubmittedFormChanges = true;
              });
            })
          )
          .subscribe((response: Recipe) => {
            this.recipe = response;
            this.syncUpdateRecipeFormControls(this.recipe);

            // set up last edit interval
            this.timeElapsedSinceLastEditIntervalId = setInterval(() => {
              this.updateTimeElapsedSinceLastEdit();
            }, 60000);
          });
      }
    });
  }

  humanizeMinutes(minutes: number): string {
    return DateUtils.getInstance().humanizeMinutes(minutes);
  }

  private updateTimeElapsedSinceLastEdit(): void {
    if (this.recipe.editedAt) {
      this.timeElapsedSinceLastEdit =
        DateUtils.getInstance().timeElapsedFromNow(this.recipe.editedAt);
    }
  }

  // onTagAddedEvent(tag: RecipeTagEnum): void {
  // this.recipe.tags.push(tag);
  // this.recipe.tags = [...this.recipe.tags, tag];
  // this.recipeService
  //   .updatetags(this.recipe.id!, this.recipe.tags)
  //   .subscribe((response: Recipe) => {
  //     this.recipe = response;
  //   });
  // }

  // onTagRemovedEvent(tag: RecipeTagEnum): void {
  // this.recipe.tags = this.recipe.tags.filter((t) => t !== tag);
  // // this.changeDetectorRef.detectChanges();
  // this.recipeService
  //   .updatetags(this.recipe.id!, this.recipe.tags)
  //   .subscribe((response: Recipe) => {
  //     this.recipe = response;
  //   });
  // }

  onIngredientAddedEvent(ingredient: Ingredient): void {
    // this.recipe.ingredients.push(ingredient);
    if (
      !this.recipe.ingredients.some((i: Ingredient) => i.id === ingredient.id)
    ) {
      this.recipeService
        .addRecipeIngredient(this.recipe.id!, ingredient)
        .subscribe((response: Recipe) => {
          this.recipe = response;
          this.updateTimeElapsedSinceLastEdit();
        });
    }
  }

  onIngredientModifiedEvent(ingredient: Ingredient): void {
    this.recipeService
      .updateRecipeIngredient(this.recipe.id!, ingredient)
      .subscribe((response: Recipe) => {
        this.recipe = response;
        this.updateTimeElapsedSinceLastEdit();
      });
  }

  onIngredientRemovedEvent(ingredient: Ingredient): void {
    this.recipeService
      .removeRecipeIngredient(this.recipe.id!, ingredient)
      .subscribe((response: Recipe) => {
        this.recipe = response;
        this.updateTimeElapsedSinceLastEdit();
      });
  }

  // FIXME BKE this does nothing for now, this.recipe does not reflect user modifications
  // FIXME BKE create wrapping form to update the full recipe
  onSaveRecipeEvent(): void {
    this.recipeService
      .updateRecipe(this.recipe)
      .subscribe((response: Recipe) => {
        console.log("updateFullRecipe", response);
        this.recipe = response;
      });
    this.isUnsubmittedFormChanges = false;
  }

  addInstruction(instruction: string): void {
    this.recipe.instructions.push(instruction);
    this.recipeService
      .updateRecipeInstructions(this.recipe.id!, this.recipe.instructions)
      .subscribe((response: Recipe) => {
        this.recipe = response;
        this.updateTimeElapsedSinceLastEdit();
      });
    this.newInstructionFormControl.reset();
  }

  updateInstruction(index: number, instruction: string): void {
    console.log("updateInstruction (index=%s)", index, instruction);
    this.recipe.instructions[index] = instruction;
    this.recipeService
      .updateRecipeInstructions(this.recipe.id!, this.recipe.instructions)
      .subscribe((response: Recipe) => {
        this.recipe = response;
        this.updateTimeElapsedSinceLastEdit();
      });
  }

  removeInstruction(index: number, instruction: string): void {
    this.recipe.instructions.splice(index, 1);
    this.recipeService
      .updateRecipeInstructions(this.recipe.id!, this.recipe.instructions)
      .subscribe((response: Recipe) => {
        this.recipe = response;
        this.updateTimeElapsedSinceLastEdit();
      });
  }

  submitUpdateRecipeForm(): void {
    if (!this.updateRecipeForm.valid) {
      return;
    }

    this.recipeService
      .updatePartialRecipe(this.recipe.id!, this.updateRecipeForm.getRawValue())
      .subscribe((response) => {
        this.recipe = response;
        this.syncUpdateRecipeFormControls(this.recipe);
      });
  }

  undoUpdateRecipeForm(): void {
    this.syncUpdateRecipeFormControls(this.recipe);
    this.isUnsubmittedFormChanges = false;
  }

  private syncUpdateRecipeFormControls(recipe: Recipe): void {
    this.updateRecipeForm.patchValue({
      description: this.recipe.description,
      servings: this.recipe.servings,
      preparationTime: this.recipe.preparationTime,
      cookingTime: this.recipe.cookingTime,
      tags: recipe.tags,
    });

    this.updateTimeElapsedSinceLastEdit();
    this.isUnsubmittedFormChanges = false;
  }
}

function replacer(key: string, value: any) {
  // filtering out properties
  if (key === "_links") {
    return undefined;
  }
  return value;
}
