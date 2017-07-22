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
    this.userDataService.getUserData(this._userQuery).then((data) => {

    });

  }

  ngOnInit(): void {
  }
}
