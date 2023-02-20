import { Injectable } from "@angular/core";
import { BehaviorSubject, delay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  // added a delay to avoid Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError
  public readonly loading$ = this.loading.asObservable().pipe(delay(1));

  constructor() {}

  next(isLoading: boolean): void {
    this.loading.next(isLoading);
  }
}
