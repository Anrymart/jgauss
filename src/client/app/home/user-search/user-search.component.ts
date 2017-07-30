import {Component, EventEmitter, Output} from "@angular/core";

declare const VK: any;

@Component({
  moduleId: module.id,
  selector: 'jg-user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: ['user-search.component.css']
})
export class UserSearchComponent {

  @Output()
  onSearch: EventEmitter<string> = new EventEmitter<string>();

  _userValue: string;

  searchUser(): void {
    this.onSearch.emit(this._userValue);
  }
}
