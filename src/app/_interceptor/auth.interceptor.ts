import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../auth/service/auth.service";
import { NavigationService } from "../_service/navigation.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if token is present, add Authorization header
    const accessToken = this.authService.getAccessToken();
    if (accessToken != null) {
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
      });
    }

    // return next.handle(request);

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          // 401 Unauthorized
          [401].includes(error.status) &&
          this.authService.isLoggedIn()
        ) {
          // TODO BKE use refresh token to get new access token
          // signing out on access token expiration for now
          console.error("user authentication token expired, signing out user");
          this.authService.signOut();
          this.navigationService.navigateToLogin();
        }
        return throwError(() => error);
      })
    );

    // XXX BKE code is incomplete
    // return next.handle(req).pipe(
    //   catchError((error) => {
    //     // attempt to re-establish authentication through refresh token
    //     const refreshToken = this.authService.getRefreshToken();
    //     if(refreshToken != null) {
    //       console.error("attempting to re-establish user authentication through refresh token");
    //       req = req.clone({
    //         url: environment.apiBaseUrl + '/api/auth/refresh-token',
    //         headers: req.headers.set("Authorization", `Bearer ${refreshToken}`)
    //       });
    //       return next.handle(req).pipe(
    //         catchError((error) => {
    //           // if refresh token did not work either, sign out user
    //           console.error("user authentication through refresh token failed, signing out user")
    //           this.authService.signOut();

    //           return throwError(() => error);
    //         }),
    //       );
    //     }

    //     return throwError(() => error);
    //   }),
    // );
  }
}
