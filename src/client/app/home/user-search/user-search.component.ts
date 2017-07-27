import {Component, OnInit} from "@angular/core";
import {VkUserDataService} from "../services/vk-user-data.sevice";

declare const VK: any;

@Component({
  moduleId: module.id,
  selector: 'jg-user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: ['user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  _userQuery: string;

  constructor(private userDataService: VkUserDataService) {

  }

  searchUser(): void {
    console.log('search', this._userQuery);
    // this.userDataService.getUserFriends(this._userQuery).then(function onFulfilled(data) {
    //   console.log(data);
    // });
    // this.userDataService.getUserData(this._userQuery).then(function onFulfilled(data) {
    //   console.log(data);
    // });

    this.userDataService.getUserSocialInfo().subscribe((data) => {
      console.log(data);
    });
  }

  ngOnInit(): void {
  }
}
