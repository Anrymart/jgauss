import {Component} from "@angular/core";
import {VkAuthService} from "../../services/vk-auth.sevice";
import {VkDataService} from "../../services/vk-data.sevice";

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'jg-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent {

  currentUser: any;

  constructor(public _authService: VkAuthService,
              public _dataService: VkDataService) {
    //todo: getUser is not optimal, add field params
    this._authService.getSessionChange().subscribe((response: any) => {
      if (response.session && !this.currentUser) {
        this._dataService.getUser().then((response: any) => {
          this.currentUser = response;
        });
      } else {
        this.currentUser = null;
      }
    });
  }
}

