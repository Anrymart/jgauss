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
   * @returns {any}
   * @param userList
   */
  getSocialInfo(userList: any): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      let requestQueue = new RequestQueue(100);
      const step = 25;
      let unfulfilled = 0;
      for (let i = 0; i < userList.length; i += step) {

        let requestCode = userList.slice(i, i + step).reduce(function reducer(code: string, friend: any) {
          return code + `{id:${friend.user_id},l:API.friends.get({user_id:${friend.user_id}})},`;
        }, '');

        let executeRequest = function executeRequest() {
          VK.Api.call('execute', {code: `return [${requestCode}];`},
            function handleResponse(response: { error?: {} }) {
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
  }

  getUserId(query: string): number {

    //check if query is link
    let linkRegExp = /vk.com\/([^?/]*)/;
    let result = linkRegExp.exec(query);

    if (result) {
      //query is link-like
      let idRegExp = /id(\d+)/;
      let id = idRegExp.test(result[1]);

    } else {
      //query is not link-like

    }
    return 0;
  }
}

class RequestQueue {

  private requests: Array<any> = [];
  private timerId: number;

  constructor(private interval: number) {
    this.timerId = +setInterval(() => {
      if (this.requests.length) {
        this.requests.shift()();
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
