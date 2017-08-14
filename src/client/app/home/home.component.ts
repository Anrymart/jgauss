import {ApplicationRef, Component, DoCheck} from "@angular/core";
import {VkAuthService} from "./services/vk-auth.sevice";
import {VkUserDataService} from "./services/vk-user-data.sevice";
import {Subscription} from "rxjs/Subscription";

@Component({
  moduleId: module.id,
  selector: 'jg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements DoCheck {

  _authorized: boolean;
  _graphData: { nodes: any[], links: any[] } = {nodes: [], links: []};

  private friendsSubscription: Subscription;

  constructor(public _authService: VkAuthService,
              private userDataService: VkUserDataService,
              private applicationRef: ApplicationRef) {
  }

  onSearch(user: string): void {
    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }

    this._graphData = {links: [], nodes: []};
    this.applicationRef.tick();
    //Another way is ChangeDetectorRef.detectChanges()
    //https://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2/35106069

    this.userDataService.getUserFriends(user).then((result) => {
      console.log(result);
      let primaryLinks = result.response.map((friend: any) => {
        return {source: +user, target: friend.user_id};
      });
      let nodes = result.response;
      nodes.push({user_id: +user});
      this._graphData = {nodes: nodes, links: primaryLinks};
      this.applicationRef.tick();

      let friendIds = nodes.map(function (friend: any) {
        return friend.user_id;
      });
      this.friendsSubscription = this.userDataService
        .getSocialInfo(result.response)
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
          this._graphData = {nodes: this._graphData.nodes, links: this._graphData.links.concat(secondaryLinks)};
          this.applicationRef.tick();
          console.log(data);
        });
    });
  }


  ngDoCheck(): void {
    console.log("do check");
    this._authorized = this._authService.isAuthorized();
  }
}
