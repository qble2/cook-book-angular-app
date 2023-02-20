import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, delay, Observable, of, tap } from "rxjs";
import { RecipeTagEnum } from "../recipe/model/recipe-tag.enum";
import { Ingredient } from "../_model/ingredient.model";
import { Metadata } from "../_model/metadata-model";
import { MetadataService } from "./metadata.service";

@Injectable({
  providedIn: "root",
})
export class AppInitService {
  private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  // added a delay to avoid Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError
  public readonly initialized$ = this.initialized.asObservable().pipe(delay(1));

  metadata: Metadata = new Metadata();

  constructor(private metadataService: MetadataService) {}

  public load(): Observable<any> {
    console.log("retrieving metadata...");
    return this.metadataService.getMetadata().pipe(
      tap((response) => {
        this.metadata = response;
        this.next(true);
      }),
      // needed not to block app loading on error
      catchError((error) => {
        console.error("retrieving metadata failed", error);
        this.next(false);
        return of(error);
      })
    );
  }

  next(IsInitialized: boolean): void {
    this.initialized.next(IsInitialized);
  }

  public getAvailableTags(): RecipeTagEnum[] {
    return this.metadata.availableTags;
  }

  public getAvailableUnitOfMeasures(): string[] {
    return this.metadata.availableUnitOfMeasures;
  }

  public getAvailableIngredients(): Ingredient[] {
    return this.metadata.availableIngredients;
  }
}
