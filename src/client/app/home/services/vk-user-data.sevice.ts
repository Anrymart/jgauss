import {Injectable} from "@angular/core";
import {VkOpenApi} from "../../../../types/vk";
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

  getUserFriends(userId?: string): Promise<any> {
    return new Promise((resolve) => {
      let params: any = {fields: 'domain, nickname'};
      if (userId) {
        params.user_id = userId;
      }
      console.log(params, userId);
      VK.Api.call('friends.get', params, resolve);
    });
  }

  /**
   * Returns data for social graph. First, user friends are returned, then their friends' ids are returned.
   * @param userId
   * @returns {any}
   */
  getUserSocialInfo(userId?: string): Observable<any> {
    return Observable.create((observer: Observer) => {
      this.getUserFriends(userId)
        .then((data) => {
          let friends = data.response;
          observer.next(friends);

          let requestQueue = new RequestQueue(100);
          const step = 25;
          let unfulfilled = 0;
          for (let i = 0; i < friends.length; i += step) {

            let requestCode = friends.slice(i, i + step).reduce(function reducer(code, friend) {
              return code + `{id:${friend.user_id},l:API.friends.get({user_id:${friend.user_id}})},`;
            }, '');

            let executeRequest = function executeRequest() {
              VK.Api.call('execute', {code: `return [${requestCode}];`}, function handleResponse(response) {
                if (response.error) {
                  console.log(response);
                  requestQueue.push(executeRequest);
                } else {
                  observer.next(response);
                  if (--unfulfilled == 0) {
                    requestQueue.destroy();
                    observer.complete();
                  }
                }
              });
            };

            requestQueue.push(executeRequest);
            unfulfilled++;
          }
        });
    });
  }
}

class RequestQueue {

  private requests: [Function] = [];
  private timerId: number;

  constructor(private interval: number) {
    this.timerId = setInterval(() => {
      if (this.requests.length) {
        this.requests.splice(0, 1)[0]();
      }
    }, interval);
  }

  push(request: Function): void {
    this.requests.push(request);
  }

  destroy() {
    clearInterval(this.timerId);
    console.log("Timeout destroyed")
  }

}
