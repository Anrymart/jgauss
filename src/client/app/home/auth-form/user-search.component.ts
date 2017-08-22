import {Component, OnInit} from "@angular/core";

declare const VK: any;

@Component({
  moduleId: module.id,
  selector: 'jg-user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: ['user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  _userQuery: string;

  searchUser(): void {
    console.log('search', this._userQuery);
  }

  ngOnInit(): void {
    VK.Auth.getLoginStatus(function (response) {
      switch (response.status) {
        case 'connected':
          console.log('connected', response);
          break;
        case 'not_authorized':
          VK.Widgets.Auth('vk_auth', {
            onAuth: function () {
              console.log();
            }
          });
          break;
      }
    });
  }
}
