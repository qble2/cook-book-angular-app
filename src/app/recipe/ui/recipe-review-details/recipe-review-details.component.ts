import { Component, Input } from "@angular/core";
import { AuthService } from "src/app/auth/service/auth.service";
import { Review } from "../../model/review.model";

@Component({
  selector: "app-recipe-review-details",
  templateUrl: "./recipe-review-details.component.html",
  styleUrls: ["./recipe-review-details.component.scss"],
})
export class RecipeReviewDetailsComponent {
  @Input() review: Review = <Review>{};

  constructor(public authService: AuthService) {}
}
