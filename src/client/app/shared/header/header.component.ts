import {Component, NgZone, Renderer2} from "@angular/core";
import {VkAuthService} from "../../services/vk-auth.sevice";
import {VkDataService} from "../../services/vk-data.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
  host: {
    '(document:click)': '_onDocumentClick()',
  }
})
export class HeaderComponent {

  _currentUser: any;
  _menuOpened: boolean;

  constructor(public _authService: VkAuthService,
              public _dataService: VkDataService,
              private zone: NgZone) {
    //todo: getUser is not optimal, add field params
    this._authService.getSessionChange().subscribe((response: any) => {
      if (response.session && !this._currentUser) {
        this._dataService.getUser().then((response: any) => {
          this._currentUser = response;
        });
      } else {
        this._currentUser = null;
      }
    });
  }

  _onUserMenuClick(event: MouseEvent): void {
    this._menuOpened = !this._menuOpened;
    event.stopPropagation();
  }

  _onDocumentClick(): void {
    this._menuOpened = false;
  }
}

