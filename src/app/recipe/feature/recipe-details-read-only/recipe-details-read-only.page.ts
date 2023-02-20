import { Component } from "@angular/core";
import { RecipeDetailsEditComponent } from "../recipe-details-edit/recipe-details.page";

@Component({
  selector: "app-recipe-details-read-only",
  templateUrl: "./recipe-details-read-only.page.html",
  styleUrls: ["./recipe-details-read-only.page.scss"],
})
export class RecipeDetailsReadOnlyComponent extends RecipeDetailsEditComponent {}
