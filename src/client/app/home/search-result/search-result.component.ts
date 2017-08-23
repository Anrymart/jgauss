import {ChangeDetectorRef, Component, Input} from "@angular/core";
import {GraphData} from "./graph/graph-data";
import {Subscription} from "rxjs/Subscription";
import {VkDataService} from "../../services/vk-data.sevice";
import {PropertyHandler} from "../../util/property-handler";

@Component({
  moduleId: module.id,
  selector: 'jg-search-result',
  templateUrl: 'search-result.component.html',
  styleUrls: ['search-result.component.css']
})
export class SearchResultComponent {

  @PropertyHandler({
    afterChange(query: string) {
      this.search(query);
    }
  })
  @Input()
  searchQuery: string;

  _targetUser: any;

  _graphData: GraphData = {nodes: [], links: []};

  private friendsSubscription: Subscription;

  constructor(private dataService: VkDataService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  async search(query: string) {
    console.log(query);

    if (this.friendsSubscription) {
      this.friendsSubscription.unsubscribe();
    }

    this.clearData();
    this.changeDetectorRef.detectChanges();

    let targetUser = this._targetUser = await this.dataService.getUser(query);
    let targetUserId = targetUser.uid;

    let targetUserFriends = await this.dataService.getUserFriends(
      {
        uid: targetUserId,
        fields: '*'
      });
    console.log(targetUserFriends);

    let primaryLinks = targetUserFriends.map((friend: any) => {
      return {source: +targetUserId, target: friend.uid};
    });

    let targetFriendIds = targetUserFriends.map((friend: any) => friend.uid);

    targetUserFriends.push(targetUser);
    this._graphData = {
      nodes: targetUserFriends,
      links: primaryLinks,
      target: targetUser
    };
    this.changeDetectorRef.detectChanges();

    this.friendsSubscription = this.dataService
      .getSocialInfo(targetFriendIds)
      .subscribe((data: any) => {
          let secondaryLinks: { source: number, target: number }[] = [];
          data.response.forEach(function (friend: { id: number, l: number[] }) {

            // // add loaded friends to graph node
            // for (let f of targetUserFriends) {
            //   if (f.id == friend.id) {
            //     f.friends = friend.l;
            //   }
            // }

            // add links to graph data
            for (let targetId of friend.l) {
              if (targetId > friend.id && targetFriendIds.includes(targetId)) {
                secondaryLinks.push({source: friend.id, target: targetId});
              }
            }
          });
          this._graphData.links = this._graphData.links.concat(secondaryLinks);
          this._graphData = Object.assign({}, this._graphData);
          this.changeDetectorRef.detectChanges();
          console.log(data);
        },
        null,
        () => {
          console.log('complete');
          this._targetUser.linkDensity =
            Math.round(2 * this._graphData.links.length / (targetUserFriends.length * (targetUserFriends.length - 1)) * 100);
          this.changeDetectorRef.detectChanges();
        });

    //todo: manage errors

    let owner = this._graphData.owner = await this.dataService.getUser('');
    console.log(owner);
    owner.friends = await this.dataService.getUserFriends(
      {
        uid: owner.uid
      });
  }

  private clearData(): void {
    this._targetUser = {};
    this._graphData = {links: [], nodes: []};
  }

}
