import {ApplicationRef, Component, DoCheck} from "@angular/core";
import {VkAuthService} from "./services/vk-auth.sevice";
import {VkDataService} from "./services/vk-data.sevice";
import {Subscription} from "rxjs/Subscription";
import {GraphData} from "./graph/graph-data";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements DoCheck {

  _authorized: boolean;
  _graphData: GraphData = {nodes: [], links: []};

  private friendsSubscription: Subscription;

  constructor(public _authService: VkAuthService,
              private userDataService: VkDataService,
              private applicationRef: ApplicationRef) {
  }

  async onSearch(query: string) {
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }

    this._graphData = {links: [], nodes: []};
    this.applicationRef.tick();
    //Another way is ChangeDetectorRef.detectChanges()
    //https://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2/35106069

    let user = await this.userDataService.getUser(query);
    let userId = user.uid;

    let userFriends = await this.userDataService.getUserFriends(userId);
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

    this.friendsSubscription = this.userDataService
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
      });

    this._graphData.owner = await this.userDataService.getUser('');
  }

  ngDoCheck(): void {
    console.log("do check");
    this._authorized = this._authService.isAuthorized();
  }
}
