import {Component, DoCheck} from "@angular/core";
import {VkAuthService} from "../services/vk-auth.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements DoCheck {

  _authorized: boolean;

  constructor(public _authService: VkAuthService) {
  }

  ngDoCheck(): void {
    console.log("do check");
    this._authorized = this._authService.isAuthorized();
  }
}
