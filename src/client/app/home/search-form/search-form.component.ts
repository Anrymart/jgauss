import {Component, EventEmitter, Output} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {VkDataService} from "../../services/vk-data.sevice";
import {Title} from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'jg-search-form',
  templateUrl: 'search-form.component.html',
  styleUrls: ['search-form.component.css']
})
export class SearchFormComponent {

  @Output()
  onSearch: EventEmitter<any> = new EventEmitter<any>();

  _inputQuery: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private dataService: VkDataService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let urlParam = params.get('id');

      if (urlParam != 'go' && urlParam != this._inputQuery) {
        // user has manually changed url
        this._onSearch(urlParam);
      }
    });
  }

  async _onSearch(query: string) {
    console.log('Search form - onSearch');

    this._inputQuery = query;

    let targetUser = await this.dataService.getUser(query);
    console.log(targetUser);

    let userPath = `id${targetUser.uid}`;
    this._inputQuery = userPath;

    this.title.setTitle(`${targetUser.first_name} ${targetUser.last_name} | Jgauss`);
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/', userPath]);
    this.onSearch.emit(targetUser);
  }
}
