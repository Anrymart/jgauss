import {Component} from "@angular/core";
import {VkAuthService} from "./services/auth.sevice";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {
  get home() {
    console.log('home');
    return 'home';
  }

  constructor(public _authService: VkAuthService) {
  }
}
