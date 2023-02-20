import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AuthService } from "src/app/auth/service/auth.service";
import { environment } from "src/environments/environment";
import { Review } from "../model/review.model";

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public getRecipeReviews(recipeId: string): Observable<Review[]> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}`)
      .pipe(map((data) => (data._embedded ? data._embedded.reviews : [])));
  }

  public getUserReviews(userId: string): Observable<Review[]> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/api/reviews/users/${userId}`)
      .pipe(map((data) => (data._embedded ? data._embedded.reviews : [])));
  }

  public getUserRecipeReview(
    recipeId: string,
    userId: string
  ): Observable<Review> {
    return this.http.get<Review>(
      `${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}/users/${userId}`
    );
  }

  public getReview(recipeId: string, userId: string): Observable<Review> {
    return this.http.get<Review>(
      `${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}/users/${userId}`
    );
  }

  // FIXME BKE average rating is desynched on client-side after this operation
  public createRecipeReview(
    recipeId: string,
    review: Review
  ): Observable<Review> {
    return this.http.post<Review>(
      `${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}`,
      review
    );
  }

  // FIXME BKE average rating is desynched on client-side after this operation
  public updateRecipeReview(
    recipeId: string,
    userId: string,
    review: Review
  ): Observable<Review> {
    return this.http.put<Review>(
      `${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}/users/${userId}`,
      review
    );
  }

  // FIXME BKE average rating is desynched on client-side after this operation
  public deleteReview(recipeId: string, userId: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiBaseUrl}/api/reviews/recipes/${recipeId}/users/${userId}`
    );
  }
}
