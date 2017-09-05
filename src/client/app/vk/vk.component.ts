import {Component, DoCheck} from "@angular/core";
import {VkAuthService} from "../services/vk-auth.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-vk',
  templateUrl: 'vk.component.html',
  styleUrls: ['vk.component.css'],
})
export class VkComponent implements DoCheck {

  _authorized: boolean;

  constructor(public _authService: VkAuthService) {
  }

  ngDoCheck(): void {
    console.log("do check");
    this._authorized = this._authService.isAuthorized();
  }
}
