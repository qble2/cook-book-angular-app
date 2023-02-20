import { Component, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { catchError } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { LoadingService } from "src/app/_service/loading.service";
import { SnackBarService } from "src/app/_service/snack-bar.service";
import { Review } from "../../model/review.model";
import { ReviewService } from "../../service/review.service";

interface ReviewForm {
  rating: FormControl<number | null>;
  comment: FormControl<string | null>;
}

@Component({
  selector: "app-recipe-review-list",
  templateUrl: "./recipe-review-list.component.html",
  styleUrls: ["./recipe-review-list.component.scss"],
})
export class RecipeReviewListComponent implements OnInit {
  @Input() recipeId!: string;
  @Input() recipeAuthorId!: string;

  reviews: Review[] = [];
  userReview?: Review;

  // TODO BKE external config ?
  minRatingAllowed: number = 0;
  maxRatingAllowed: number = 5;

  reviewForm: FormGroup<ReviewForm>;

  isPostingReviewAllowed: boolean = true;

  constructor(
    public loadingService: LoadingService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    public snackBarService: SnackBarService
  ) {
    this.reviewForm = new FormGroup({
      rating: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(0), Validators.max(5)],
      }),
      comment: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  ngOnInit(): void {
    this.isPostingReviewAllowed =
      this.authService.isLoggedIn() &&
      this.authService.getLoggedInUser()?.id !== this.recipeAuthorId;

    this.reviewService.getRecipeReviews(this.recipeId).subscribe((response) => {
      this.reviews = response;
    });

    if (this.isPostingReviewAllowed) {
      // this has to be done through its own request, since:
      //  - returned reviews are paginated, and user review could be missing
      //  - prevent client to have to look for it in the returned reviews
      this.reviewService
        .getReview(this.recipeId, this.authService.getLoggedInUser()?.id!)
        .subscribe((response) => {
          this.userReview = response;
          this.syncReviewFormValues();
        });
    }
  }

  onSubmit(): void {
    if (!this.reviewForm.valid) {
      return;
    }

    // TODO BKE rework
    if (this.userReview) {
      this.reviewService
        .updateRecipeReview(
          this.recipeId,
          this.authService.getLoggedInUser()?.id!,
          this.reviewForm.getRawValue()
        )
        .pipe(
          catchError((serverResponseError: ServerResponseError) =>
            this.snackBarService.handleServerResponseError(serverResponseError)
          )
        )
        .subscribe((response) => {
          this.userReview = response;
          this.syncReviewFormValues();
        });
    } else {
      this.reviewService
        .createRecipeReview(this.recipeId!, this.reviewForm.getRawValue())
        .pipe(
          catchError((serverResponseError: ServerResponseError) =>
            this.snackBarService.handleServerResponseError(serverResponseError)
          )
        )
        .subscribe((response) => {
          this.userReview = response;
          this.syncReviewFormValues();
        });
    }
  }

  deleteReview(): void {
    if (this.userReview) {
      this.reviewService
        .deleteReview(this.recipeId, this.authService.getLoggedInUser()?.id!)
        .pipe(
          catchError((serverResponseError: ServerResponseError) =>
            this.snackBarService.handleServerResponseError(serverResponseError)
          )
        )
        .subscribe((response) => {
          this.userReview = undefined;
          this.reviewForm.reset();
        });
    }
  }

  private syncReviewFormValues(): void {
    if (this.userReview) {
      this.reviewForm.patchValue({
        rating: this.userReview.rating,
        comment: this.userReview.comment,
      });
    }
  }
}
