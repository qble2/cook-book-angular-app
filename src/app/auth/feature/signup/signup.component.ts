import { Component } from "@angular/core";
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
import { AuthService } from "../../service/auth.service";

interface SignupForm {
  username: FormControl<string>;
  password: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  signupForm: FormGroup<SignupForm> = new FormGroup<SignupForm>({
    username: new FormControl<string>("", {
      validators: Validators.required,
      nonNullable: true,
    }),
    password: new FormControl<string>("", {
      validators: Validators.required,
      nonNullable: true,
    }),
    firstName: new FormControl<string>("", {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: new FormControl<string>("", {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: new FormControl<string>("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  serverResponseError?: ServerResponseError;

  hidePassword: boolean = true;

  constructor(
    public loadingService: LoadingService,
    public authService: AuthService,
    public navigationService: NavigationService,
    private formBuilder: FormBuilder
  ) {}

  onSubmit(): void {
    if (!this.signupForm.valid) {
      return;
    }

    this.authService
      .signUp(this.signupForm.getRawValue())
      .pipe(
        catchError((serverResponseError: ServerResponseError) => {
          console.error("user signup failed", serverResponseError);
          this.serverResponseError = serverResponseError;
          return EMPTY;
        })
      )
      .subscribe((response) => {
        console.log(
          "user " + response.username + " has been successfully registered",
          response
        );
        // no auto-login in case a confirm email feature exists
        this.navigationService.navigateToLogin();
      });
  }
}
