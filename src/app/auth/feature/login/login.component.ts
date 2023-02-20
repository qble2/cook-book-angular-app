import { Component, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { catchError, EMPTY } from "rxjs";
import { ServerResponseError } from "src/app/_model/server-response-error.model";
import { LoadingService } from "src/app/_service/loading.service";
import { NavigationService } from "src/app/_service/navigation.service";
import { LoginResponse } from "../../model/login-response";
import { AuthService } from "../../service/auth.service";

interface LoginForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  loginForm: FormGroup<LoginForm>;

  serverResponseError?: ServerResponseError;
  hidePassword: boolean = true;

  constructor(
    public loadingService: LoadingService,
    public authService: AuthService,
    public navigationService: NavigationService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = new FormGroup<LoginForm>({
      username: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
      password: new FormControl<string | null>(null, {
        validators: Validators.required,
      }),
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.getRawValue();
    if (!this.loginForm.valid || !username || !password) {
      return;
    }

    this.authService
      .logIn(username, password)
      .pipe(
        catchError((serverResponseError: ServerResponseError) => {
          console.error("user login failed", serverResponseError);
          this.serverResponseError = serverResponseError;
          return EMPTY;
        })
      )
      .subscribe((response) => {
        console.log("user has successfully logged in", response);
        this.onSuccessfulLogIn(response);
      });
  }

  private onSuccessfulLogIn(loginResponse: LoginResponse): void {
    this.authService.saveTokens(loginResponse.tokens);
    this.authService.saveUser(loginResponse.user);
    if (this.authService.attemptedAuthRequiredUrl) {
      console.log(
        "redirecting freshly logged in user to the originally attempted url"
      );
      this.navigationService.navigateToRoute(
        this.authService.attemptedAuthRequiredUrl
      );
      this.authService.attemptedAuthRequiredUrl = undefined;
    } else {
      this.navigationService.navigateToHome();
    }
  }
}
