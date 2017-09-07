import {Component} from "@angular/core";
import {VkAuthService} from "../services/vk-auth.sevice";

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
    this.authService.login(function (status: any) {
      console.log(status);
    }, 2 + 4);
  }
}
