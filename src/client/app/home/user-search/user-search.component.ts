import {ApplicationRef, Component} from "@angular/core";
import {GraphData} from "./graph/graph-data";
import {Subscription} from "rxjs/Subscription";
import {VkAuthService} from "../../services/vk-auth.sevice";
import {VkDataService} from "../../services/vk-data.sevice";

@Component({
  moduleId: module.id,
  selector: 'jg-user-search',
  templateUrl: 'user-search.component.html',
  styleUrls: ['user-search.component.css']
})
export class UserSearchComponent {

  _userQuery: string;

  _resultUser: any;

  _graphData: GraphData = {nodes: [], links: []};

  private friendsSubscription: Subscription;

  constructor(public _authService: VkAuthService,
              private dataService: VkDataService,
              private applicationRef: ApplicationRef) {
  }

  async onSearch(query: string = this._userQuery) {
    this._userQuery = query;

    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }

    this.clearData();
    this.applicationRef.tick();
    //Another way is ChangeDetectorRef.detectChanges()
    //https://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2/35106069

    let user = this._resultUser = await this.dataService.getUser(query);
    let userId = user.uid;

    let userFriends = await this.dataService.getUserFriends(userId);
    console.log(userFriends);

    let primaryLinks = userFriends.map((friend: any) => {
      return {source: +userId, target: friend.uid};
    });

    let friendIds = userFriends.map(function (friend: any) {
      return friend.uid;
    });

    userFriends.push(user);
    this._graphData = {
      nodes: userFriends,
      links: primaryLinks,
      target: user
    };
    this.applicationRef.tick();

    this.friendsSubscription = this.dataService
      .getSocialInfo(friendIds)
      .subscribe((data) => {
          let secondaryLinks: { source: number, target: number }[] = [];
          data.response.forEach(function (friend: { id: number, l: number[] }) {
            for (let targetId of friend.l) {
              if (targetId > friend.id && friendIds.includes(targetId)) {
                secondaryLinks.push(
                  {source: friend.id, target: targetId}
                );
              }
            }
          });
          this._graphData.links = this._graphData.links.concat(secondaryLinks);
          this._graphData = Object.assign({}, this._graphData);
          this.applicationRef.tick();
          console.log(data);
        },
        null,
        () => {
          console.log('complete');
          this._resultUser.linkDensity =
            Math.round(2 * this._graphData.links.length / (userFriends.length * (userFriends.length - 1)) * 100);
          this.applicationRef.tick();
        });

    this._graphData.owner = await this.dataService.getUser('');
  }

  private clearData(): void {
    this._resultUser = {};
    this._graphData = {links: [], nodes: []};
  }

}
