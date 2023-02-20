import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginResponse } from "../model/login-response";
import { Tokens } from "../model/tokens.model";
import { User } from "../model/user.model";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const LOGGED_IN_USER_KEY = "user";

const AUTH_API = environment.apiBaseUrl + "/api/auth";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  attemptedAuthRequiredUrl?: string;

  constructor(private http: HttpClient) {}

  public isLoggedIn(): boolean {
    return this.getAccessToken() != null;
  }

  public getLoggedInUser(): User | undefined {
    const loggedInUser = window.sessionStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedInUser) {
      return JSON.parse(loggedInUser);
    }
    // return {};
    return undefined;
  }

  public signOut(): void {
    window.sessionStorage.clear();
    console.log("user has signed out");
  }

  public signUp(user: User): Observable<User> {
    return this.http.post<User>(
      `${environment.apiBaseUrl}/api/auth/signup`,
      user
    );
  }

  public logIn(username: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set("username", username)
      .set("password", password);

    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}/api/auth/login`,
      params
    );
  }

  public refreshToken(refreshToken: string): Observable<Object> {
    return this.http.post(
      AUTH_API + "refreshtoken",
      { refreshToken: refreshToken },
      httpOptions
    );
  }

  public saveUser(loggedInUser: User): void {
    window.sessionStorage.removeItem(LOGGED_IN_USER_KEY);
    window.sessionStorage.setItem(
      LOGGED_IN_USER_KEY,
      JSON.stringify(loggedInUser)
    );
  }

  public saveTokens(tokens: Tokens): void {
    this.saveAccessToken(tokens.access_token);
    this.saveRefreshToken(tokens.refresh_token);
  }

  private saveAccessToken(token: string): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    // const user: User = this.getUser();
    // if (user.id) {
    //   this.saveUser({ ...user, accessToken: token });
    // }
  }

  private saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
