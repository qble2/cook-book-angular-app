import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/feature/login/login.component";
import { SignupComponent } from "./auth/feature/signup/signup.component";
import { RecipeDetailsEditComponent } from "./recipe/feature/recipe-details-edit/recipe-details.page";
import { RecipeDetailsReadOnlyComponent } from "./recipe/feature/recipe-details-read-only/recipe-details-read-only.page";
import { RecipeListComponent } from "./recipe/feature/recipe-list/recipe-list.page";
import { CreateRecipeStepperComponent } from "./recipe/feature/recipe-stepper/create-recipe-stepper/create-recipe-stepper.page";
import { EditRecipeStepperComponent } from "./recipe/feature/recipe-stepper/edit-recipe-stepper/edit-recipe-stepper.page";
import { TestComponent } from "./test/test.page";
import { AnyCanActivateGuard } from "./_guard/any.can-activate.guard";
import { AuthenticatedCanActivateGuard } from "./_guard/authenticated.can-activate.guard";
import { EditRecipeCanActivateGuard } from "./_guard/edit-recipe.can-activate.guard";
import { UnauthenticatedCanActivateGuard } from "./_guard/unauthenticated.can-activate.guard";

// TODO BKE rework with children paths
// XXX BKE order matters
const routes: Routes = [
  {
    path: "test",
    component: TestComponent,
    canActivate: [AnyCanActivateGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [UnauthenticatedCanActivateGuard],
  },
  {
    path: "signup",
    component: SignupComponent,
    canActivate: [UnauthenticatedCanActivateGuard],
  },
  {
    path: "recipes",
    component: RecipeListComponent,
    canActivate: [AnyCanActivateGuard],

    // children: [
    //   {
    //     path: "create-stepper",
    //     component: CreateRecipeStepperComponent,
    //     canActivate: [AuthenticatedGuard],
    //   },
    // ],
  },
  {
    path: "recipes/create-stepper",
    component: CreateRecipeStepperComponent,
    canActivate: [AuthenticatedCanActivateGuard],
  },
  {
    // edit (stepper)
    // required parameter
    path: "recipes/:recipeId/edit-stepper",
    component: EditRecipeStepperComponent,
    canActivate: [AuthenticatedCanActivateGuard, EditRecipeCanActivateGuard],
  },
  {
    // edit
    // required parameter
    path: "recipes/:recipeId/edit",
    component: RecipeDetailsEditComponent,
    canActivate: [AuthenticatedCanActivateGuard, EditRecipeCanActivateGuard],
  },
  {
    // required parameter
    path: "recipes/:recipeId",
    component: RecipeDetailsReadOnlyComponent,
    canActivate: [AnyCanActivateGuard],
  },

  { path: "", redirectTo: "recipes", pathMatch: "full" },
  { path: "**", redirectTo: "recipes" },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      routes
      // { enableTracing: true } // <-- debugging purposes only)
    ),
  ],
  providers: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
