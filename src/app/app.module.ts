import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from "@angular/core";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "./angular-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/feature/login/login.component";
import { SignupComponent } from "./auth/feature/signup/signup.component";
import { RecipeDetailsEditComponent } from "./recipe/feature/recipe-details-edit/recipe-details.page";
import { RecipeDetailsReadOnlyComponent } from "./recipe/feature/recipe-details-read-only/recipe-details-read-only.page";
import { RecipeListComponent } from "./recipe/feature/recipe-list/recipe-list.page";
import { CreateRecipeStepperComponent } from "./recipe/feature/recipe-stepper/create-recipe-stepper/create-recipe-stepper.page";
import { EditRecipeStepperComponent } from "./recipe/feature/recipe-stepper/edit-recipe-stepper/edit-recipe-stepper.page";
import { RecipeStepperComponent } from "./recipe/feature/recipe-stepper/recipe-stepper.page";
import { RecipeAddIngredientComponent } from "./recipe/ui/recipe-add-ingredient/recipe-add-ingredient.component";
import { RecipeCardComponent } from "./recipe/ui/recipe-card/recipe-card.component";
import { RecipeDetailsHeaderComponent } from "./recipe/ui/recipe-details-header/recipe-details-header.component";
import { RecipeIngredientComponent } from "./recipe/ui/recipe-ingredient/recipe-ingredient.component";
import { RecipeReviewDetailsComponent } from "./recipe/ui/recipe-review-details/recipe-review-details.component";
import { RecipeReviewListComponent } from "./recipe/ui/recipe-review-list/recipe-review-list.component";
import { RecipeSearchIngredientFilterComponent } from "./recipe/ui/recipe-search-ingredient-filter/recipe-search-ingredient-filter.component";
import { RecipeSearchComponent } from "./recipe/ui/recipe-search/recipe-search.component";
import { TestComponent } from "./test/test.page";
import { AuthenticatedCanActivateGuard } from "./_guard/authenticated.can-activate.guard";
import { UnauthenticatedCanActivateGuard } from "./_guard/unauthenticated.can-activate.guard";
import { AuthInterceptor } from "./_interceptor/auth.interceptor";
import { LoadingInterceptor } from "./_interceptor/loading.interceptor";
import { LoggingInterceptor } from "./_interceptor/logging.interceptor";
import { ServerResponseErrorInterceptor } from "./_interceptor/server-response-error.interceptor";
import { ServerStatusInterceptor } from "./_interceptor/server-status.interceptor";
import { HeaderComponent } from "./_layout/header/header.component";
import { PageComponent } from "./_layout/page/page.component";
import { basicSorterPipePipe } from "./_pipe/recipe-tags-sorter.pipe";
import { AppInitService } from "./_service/app-init.service";
import { ChipListComponent } from "./_shared/chip-list/chip-list.component";
import { CloseCardButtonComponent } from "./_shared/close-card-button/close-card-button.component";
import { IngredientAutocompleteFormFieldComponent } from "./_shared/ingredient-autocomplete-form-field/ingredient-autocomplete-form-field.component";
import { PasswordFormFieldComponent } from "./_shared/password-form-field/password-form-field.component";
import { ServerResponseErrorDetailsComponent } from "./_shared/server-response-error-details/server-response-error-details.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    RecipeListComponent,
    RecipeSearchComponent,
    RecipeCardComponent,
    RecipeDetailsEditComponent,
    RecipeDetailsReadOnlyComponent,
    RecipeIngredientComponent,
    RecipeReviewListComponent,
    RecipeReviewDetailsComponent,
    RecipeAddIngredientComponent,
    basicSorterPipePipe,
    PageComponent,
    TestComponent,
    ChipListComponent,
    PasswordFormFieldComponent,
    RecipeAddIngredientComponent,
    RecipeSearchIngredientFilterComponent,
    CreateRecipeStepperComponent,
    CloseCardButtonComponent,
    RecipeDetailsHeaderComponent,
    EditRecipeStepperComponent,
    ServerResponseErrorDetailsComponent,
    RecipeStepperComponent,
    IngredientAutocompleteFormFieldComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerStatusInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerResponseErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true,
    },
    AuthenticatedCanActivateGuard,
    UnauthenticatedCanActivateGuard,
    // DatePipe,
    // { provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

export function initializeApp(appInitService: AppInitService) {
  return () => appInitService.load();
}
