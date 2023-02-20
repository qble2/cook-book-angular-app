import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { finalize, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;
    let response: string;

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            ok = "succeeded";
            response = event.body;
          } else {
            ok = "";
          }
        },
        error: (error) => (ok = "failed"),
      }),

      finalize(() => {
        const elapsed = Date.now() - started;
        const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
        // console.log(msg, "response", response);
        console.log(msg, "\n\t\t\t\tresponse", response);
      })
    );
  }
}
