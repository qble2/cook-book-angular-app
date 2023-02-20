import { Component } from "@angular/core";
import { NavigationService } from "src/app/_service/navigation.service";

@Component({
  selector: "app-close-card-button",
  templateUrl: "./close-card-button.component.html",
  styleUrls: ["./close-card-button.component.scss"],
})
export class CloseCardButtonComponent {
  constructor(public navigationService: NavigationService) {}
}
