import {Component, EventEmitter, Output} from "@angular/core";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {VkDataService} from "../services/vk-data.sevice";
import {Title} from "@angular/platform-browser";
import {PropertyHandler} from "../../util/property-handler";
import {Subscription} from "rxjs/Subscription";

@Component({
  moduleId: module.id,
  selector: 'jg-search-form',
  templateUrl: 'search-form.component.html',
  styleUrls: ['search-form.component.css']
})
export class SearchFormComponent {

  @Output()
  onSearch: EventEmitter<any> = new EventEmitter<any>();

  @PropertyHandler({
    afterChange() {
      this._notFound = false;
    }
  })
  _searchQuery: string;

  _notFound: boolean = false;

  _loading: boolean = false;

  private routeSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private dataService: VkDataService) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      let urlParam = params.get('id');

      if (urlParam == 'go') {
        this.title.setTitle(`ВКонтакте | Jgauss`);
        this.onSearch.emit(null);
        return;
      }

      if (urlParam != this._searchQuery) {
        // user has manually changed url
        this._onSearch(urlParam);
      }
    });
  }

  async _onSearch(query: string) {
    this._loading = true;

    if (query == 'me') {
      query = '';
    }

    this._searchQuery = query;
    this._notFound = false;

    let targetUser;
    try {
      targetUser = await this.dataService.getUser(query);
    } catch (error) {
      this._loading = false;
      console.log(error);
      if (error.error_code == 113) {
        this._notFound = true;
      }
      return;
    }

    let userPath = `id${targetUser.uid}`;
    this._searchQuery = userPath;

    this.title.setTitle(`${targetUser.first_name} ${targetUser.last_name} | Jgauss`);
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['vk/', userPath]);
    this.onSearch.emit(targetUser);
    this._loading = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
