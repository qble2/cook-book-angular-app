import { Injectable } from "@angular/core";
import { BehaviorSubject, delay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ServerStatusService {
  private online: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  // added a delay to avoid Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError
  public readonly online$ = this.online.asObservable().pipe(delay(1));

  constructor() {}

  next(isOnline: boolean): void {
    this.online.next(isOnline);
  }
}
