import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { LoadingService } from "../_service/loading.service";

@Injectable({
  providedIn: "root",
})
export class LoadingInterceptor implements HttpInterceptor {
  totalRequests: number = 0;
  requestsCompleted: number = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.next(true);
    this.totalRequests++;

    return next.handle(req).pipe(
      finalize(() => {
        this.requestsCompleted++;
        console.log(
          "requestsCompleted: %d out of totalRequests: %d",
          this.requestsCompleted,
          this.totalRequests
        );

        if (this.requestsCompleted === this.totalRequests) {
          this.loadingService.next(false);
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      })
    );
  }
}
