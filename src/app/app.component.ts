import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { AuthService } from "./auth/service/auth.service";
import { AppInitService } from "./_service/app-init.service";
import { LoadingService } from "./_service/loading.service";
import { NavigationService } from "./_service/navigation.service";
import { ServerStatusService } from "./_service/server-status.service";

const ROUTES_PRE_LOGIN = ["recipes", "users", "test"];
const ROUTES_POST_LOGIN = ["recipes", "favorites", "users"];
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  title = "cook-book-app";

  constructor(
    public appInitService: AppInitService,
    public serverStatusService: ServerStatusService,
    public loadingService: LoadingService,
    public navigationService: NavigationService,
    public authService: AuthService
  ) {}

  getRoutes(): string[] {
    if (this.authService.isLoggedIn()) {
      return ROUTES_POST_LOGIN;
    }

    return ROUTES_PRE_LOGIN;
  }

  reloadPage(): void {
    window.location.reload();
  }

  signOut(): void {
    this.authService.signOut();
    this.navigationService.navigateToHome();
  }
}
