import { Component, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DateUtils } from "src/app/_utility/date-utils";
import { Recipe } from "../../model/recipe.model";
import { RecipeService } from "../../service/recipe.service";
// import VanillaTilt from "vanilla-tilt";

@Component({
  selector: "app-recipe-card",
  templateUrl: "./recipe-card.component.html",
  styleUrls: ["./recipe-card.component.scss"],
})
export class RecipeCardComponent {
  @Input() recipe: Recipe = new Recipe();

  constructor(
    private recipeService: RecipeService,
    private formBuilder: FormBuilder
  ) {}

  // ngOnInit(): void {
  // VanillaTilt.init(document.querySelector('.recipe') as any);
  // VanillaTilt.init(document.querySelectorAll('.recipe') as any);
  // }

  humanizeMinutes(minutes: number): string {
    return DateUtils.getInstance().humanizeMinutes(minutes);
  }

  timeElapsedFromNow(date: Date): string {
    return DateUtils.getInstance().timeElapsedFromNow(date);
  }
}
