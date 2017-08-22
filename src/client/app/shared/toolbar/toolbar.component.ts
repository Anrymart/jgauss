import {Component} from "@angular/core";
import {VkAuthService} from "../../services/vk-auth.sevice";
import {VkDataService} from "../../services/vk-data.sevice";

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

  userPictureUrl: string;

  constructor(public _authService: VkAuthService,
              public _dataService: VkDataService) {
    //todo: getUser is not optimal, add field params
    this._authService.getSessionChange().subscribe((response: any) => {
      if (response.session && !this.userPictureUrl) {
        this._dataService.getUser().then((response: any) => {
          this.userPictureUrl = response.photo_50;
        });
      } else {
        this.userPictureUrl = null;
      }
    });
  }
}

