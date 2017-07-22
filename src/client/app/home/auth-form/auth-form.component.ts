import {Component} from "@angular/core";
import {VkAuthService} from "../services/vk-auth.sevice";

declare const VK: any;

@Component({
  moduleId: module.id,
  selector: 'jg-auth-form',
  templateUrl: 'auth-form.component.html',
  styleUrls: ['auth-form.component.css']
})
export class AuthFormComponent {

  constructor(private authService: VkAuthService) {
  }

  login(): void {
    this.authService.login(function (status) {
      console.log(status);
    });
  }
}
