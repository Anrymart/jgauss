import {Injectable} from "@angular/core";
import {VkAuthUser, VkOpenApi} from "../../../../types/vk";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

declare const VK: VkOpenApi;

@Injectable()
export class VkUserDataService {

  constructor() {
  }

  getUserData(user: string): Promise<any> {
    return new Promise((resolve) => {
      VK.Api.call('execute.getSecondLevelFriends', {}, resolve);
    });
  }

  getUserFriends(user?: string): Promise<any> {
    return new Promise((resolve) => {
      VK.Api.call('friends.get', {fields: 'domain, nickname'}, resolve);
    });
  }

  getUserSocialInfo(user?: string): Observable<any> {
    return Observable.create((observer: Observer) => {
      this.getUserFriends(user)
        .then((data) => {
          let friends = data.response;
          observer.next(friends);

          let onResponse = (data) => {
            observer.next(data);
          };

          // for (let i = 0; i < friends.length; i += 24) {
          //   VK.Api.call('execute.getSecondLevelFriends', {offset: i}, onResponse);
          // }
        });
    });
  }
}
