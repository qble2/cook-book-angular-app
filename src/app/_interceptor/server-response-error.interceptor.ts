import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { ServerResponseError } from "../_model/server-response-error.model";
import { SnackBarService } from "../_service/snack-bar.service";

@Injectable()
export class ServerResponseErrorInterceptor implements HttpInterceptor {
  constructor(private snackBarService: SnackBarService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // if (error.error instanceof ErrorEvent) {
        //   // client side error
        // } else {
        //   // server side error
        // }
        const serverResponseError: ServerResponseError = error.error;
        console.error("serverResponseError", serverResponseError);
        // this.snackBarService.displayServerResponseError(serverResponseError);

        // return throwError(() => error);
        return throwError(() => serverResponseError);
      })
    );
  }
}
