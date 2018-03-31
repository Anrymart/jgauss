import {ChangeDetectorRef, Component, Input, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {PropertyHandler} from "../../util/property-handler";
import {VkCity, VkOpenApi} from "../types/vk";
import {VkDataService} from "../services/vk-data.sevice";
import {GraphData} from "../../shared/graph/graph-data.model";

declare const VK: VkOpenApi;

@Component({
  moduleId: module.id,
  selector: 'jg-search-result',
  templateUrl: 'search-result.component.html',
  styleUrls: ['search-result.component.css']
})
export class SearchResultComponent implements OnDestroy {

  @PropertyHandler({
    afterChange(query: string) {
      this.search(query);
    }
  })
  @Input()
  searchQuery: string;

  _targetUser: any;

  _graphData: GraphData = {nodes: [], links: []};

  _loading: boolean;
  _errorMessage: string;

  _buttonGroupModel: { name: string, text: string, active?: boolean }[];

  private friendsSubscription: Subscription;

  constructor(private dataService: VkDataService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  async load(targetUser: any) {

    this.refresh();
    if (!targetUser) {
      return;
    }

    this._targetUser = targetUser;
    let targetUserId = targetUser.id;

    let targetUserFriends: any;
    try {
      targetUserFriends = (await this.dataService.getUserFriends(
        {
          user_id: targetUserId,
          fields: VkDataService.FRIENDS_FIELDS
        })).items;
    } catch (error) {
      switch (error.error_code) {
        case 18:
          this._errorMessage = 'Профиль был удалён или забанен';
          break;
        default:
          this._errorMessage = 'Произошла ошибка при загрузке данных';
      }
      this._loading = false;
      return;
    }

    targetUser.friendsCount = targetUserFriends.length;

    let initialLinks = targetUserFriends.map((friend: any) => {
      return {source: +targetUserId, target: friend.id};
    });

    let targetFriendIds = targetUserFriends.map((friend: any) => friend.id);

    targetUserFriends.push(targetUser);
    this._graphData = {
      nodes: targetUserFriends,
      links: initialLinks,
      target: targetUser
    };
    this.changeDetectorRef.detectChanges();

    this.friendsSubscription = this.dataService
      .getSocialInfo(targetFriendIds)
      .subscribe((data: any) => {
          let secondaryLinks: { source: number, target: number }[] = [];
          data.forEach(function (friend: { id: number, l: { count: number, items: number[] } }) {

            let items = friend.l.items || [];

            // add loaded friends to graph node
            for (let f of targetUserFriends) {
              if (f.id == friend.id) {
                f.friends = items;
                f.commonFriends = items.filter((id) => {
                  return targetFriendIds.includes(id);
                });
                break;
              }
            }

            // add links to graph user
            for (let targetId of items) {
              if (targetId > friend.id && targetFriendIds.includes(targetId)) {
                secondaryLinks.push({source: friend.id, target: targetId});
              }
            }
          });
          this._graphData.links = this._graphData.links.concat(secondaryLinks);
          this._graphData = Object.assign({}, this._graphData);
          this.changeDetectorRef.detectChanges();
        },
        null,
        () => {
          this._loading = false;
          this.changeDetectorRef.detectChanges();
        });

    // noinspection JSIgnoredPromiseFromCall
    this.getOwnerInfo();

    // noinspection JSIgnoredPromiseFromCall
    this.getCityTitles();

    this.updateWidgets(targetUserId);

    this.dataService.getFriendLikesCount(targetUserId).then((friendLikes: any) => {
      this._graphData.target.friendLikes = friendLikes;
      this._graphData.nodes.forEach((node: any) => {
        node.likesCount = friendLikes[node.id];
      });
    });
  }

  async getOwnerInfo(): Promise<{ friends: any[] }> {
    let owner = this._graphData.owner = await this.dataService.getUser('');
    owner.friends = (await this.dataService.getUserFriends(
      {
        user_id: owner.id
      })).items;
    return this._graphData.owner = owner;
  }

  async getCityTitles() {
    let cityIds: number[] = [];
    this._graphData.nodes.forEach((node) => {
      if (!cityIds.includes(node.city)) {
        cityIds.push(node.city);
      }
    });

    let cityList = await this.dataService.getCitiesById(cityIds);
    let cities: any = {};
    cityList.forEach((city: VkCity) => {
      cities[city.cid] = city.name;
    });

    this._graphData.nodes.forEach((node: any) => {
      node.city_name = cities[node.city];
    });
  }

  private updateWidgets(userId: number): void {
    let removeChildren = (element: HTMLElement) => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    };
    removeChildren(document.getElementById('vk-comments'));
    removeChildren(document.getElementById('vk-like'));
    VK.Widgets.Comments('vk-comments', {}, userId);
    VK.Widgets.Like('vk-like', {}, userId);
  }

  private refresh(): void {
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }
    this._loading = true;
    this._targetUser = null;
    this._graphData = null;
    this._buttonGroupModel = [
      {name: 'default', text: 'Я', active: true},
      {name: 'owner-friends', text: 'Мои друзья'},
      {name: 'sex', text: 'Девушки/парни'},
      {name: 'target-likes', text: 'Лайки'},
      {name: 'online', text: 'Пользователи онлайн'}];
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }
  }
}
