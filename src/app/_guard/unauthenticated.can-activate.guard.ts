import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/service/auth.service";
import { NavigationService } from "../_service/navigation.service";

@Injectable({
  providedIn: "root",
})
export class UnauthenticatedCanActivateGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    private navigationService: NavigationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn()) {
      this.navigationService.navigateToHome();
    }

    return true;
  }
}
