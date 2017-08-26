import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Router} from "@angular/router";
import {PropertyHandler} from "../../util/property-handler";
import {VkDataService} from "../../services/vk-data.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-search-form',
  templateUrl: 'search-form.component.html',
  styleUrls: ['search-form.component.css']
})
export class SearchFormComponent {

  @PropertyHandler({
    beforeChange(value: string): boolean | void {
      if (value == 'go') {
        return false;
      }

      // user has manually changed url
      this._onSearch(value);
    }
  })
  @Input()
  query: string;

  @Output()
  onSearch: EventEmitter<any> = new EventEmitter<any>();

  _inputQuery: string;

  constructor(private router: Router,
              private dataService: VkDataService) {
  }

  async _onSearch(query: string) {
    this._inputQuery = query;

    let targetUser = await this.dataService.getUser(query);

    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/', `id${targetUser.uid}`]);

    this.onSearch.emit(targetUser);
    // this.onSearch.emit(JSON.stringify(targetUser));
  }
}
