import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EMPTY, Observable } from "rxjs";
import { ServerResponseError } from "../_model/server-response-error.model";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public handleServerResponseError(
    serverResponseError: ServerResponseError
  ): Observable<never> {
    this.displayServerResponseError(serverResponseError);
    // return throwError(() => serverResponseError);
    return EMPTY; // do not propagate the error
  }

  public displayInfoMessage(message: string): void {
    this.snackBar.open(message, "close", {
      // duration: 3000,
      // horizontalPosition: "right",
      // verticalPosition: "bottom",
      panelClass: "snackbar-info",
    });
  }

  public displayServerResponseError(
    serverResponseError: ServerResponseError
  ): void {
    let message = serverResponseError.message || "An error has occured";
    if (serverResponseError.details) {
      serverResponseError.details.forEach(
        (detail) => (message += "\n\t- " + detail)
      );
    }
    this.snackBar.open(message, "close", {
      // duration: 3000,
      // horizontalPosition: "right",
      // verticalPosition: "bottom",
      panelClass: "snackbar-error",
    });
  }
}
