import {Component} from "@angular/core";
import {VkAuthService} from "../../services/vk-auth.sevice";

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'jg-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent {
  constructor(public _authService: VkAuthService) {
  }
}

