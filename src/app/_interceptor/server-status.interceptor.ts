import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { NavigationService } from "../_service/navigation.service";
import { ServerStatusService } from "../_service/server-status.service";

@Injectable()
export class ServerStatusInterceptor implements HttpInterceptor {
  constructor(
    private navigationService: NavigationService,
    private serverStatusService: ServerStatusService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(() => this.serverStatusService.next(true)),
      catchError((error) => {
        if (error.status == 0) {
          console.error(
            "no response from REST API, error.status: %s",
            error.status,
            error
          );
          this.serverStatusService.next(false);
          this.navigationService.navigateToError();
        }
        return throwError(() => error);
      })
    );
  }
}
