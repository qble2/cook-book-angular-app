import { Component, Input } from "@angular/core";
import { ServerResponseError } from "src/app/_model/server-response-error.model";

@Component({
  selector: "app-server-response-error-details",
  templateUrl: "./server-response-error-details.component.html",
  styleUrls: ["./server-response-error-details.component.scss"],
})
export class ServerResponseErrorDetailsComponent {
  @Input() error?: ServerResponseError;

  constructor() {}
}
