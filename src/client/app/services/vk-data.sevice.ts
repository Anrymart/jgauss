import {Injectable} from "@angular/core";
import {VkOpenApi} from "../../../types/vk";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

declare const VK: VkOpenApi;

@Injectable()
export class VkDataService {

  /**
   * Searches user for given query. Query can be a link, user id or short name.
   *
   * @param {string} query
   * @returns {Promise<any>}
   */
  getUser(query: string): Promise<any> {

    //check if query is link
    let linkRegExp = /vk.com\/([^?/]*)/;
    let domainQueryResult = linkRegExp.exec(query);

    let getUserByDomain = (domain: string): any => {
      return new Promise((resolve) => {
        VK.Api.call('users.get', {user_ids: [domain]}, function handleResponse({response}: any) {
          return resolve(response[0]);
        });
      });
    };

    if (domainQueryResult) {
      //query is link-like
      return getUserByDomain(domainQueryResult[1]);
    }

    //query is not link-like
    return getUserByDomain(query);
  }

  getUserFriends(userId?: string | number): Promise<any> {
    return new Promise((resolve) => {
      let params: any = {fields: 'domain, nickname'};
      if (userId) {
        params.user_id = userId;
      }
      VK.Api.call('friends.get', params, function handleResponse({response}: any) {
        resolve(response);
      });
    });
  }

  /**
   * @returns {any}
   * @param userList
   */
  getSocialInfo(userList: Array<number | string>): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      let requestQueue = new RequestQueue(100);
      const step = 25;
      let unfulfilled = 0;
      for (let i = 0; i < userList.length; i += step) {

        let requestCode = userList.slice(i, i + step).reduce(function reducer(code: string, friend: any) {
          return code + `{id:${friend},l:API.friends.get({user_id:${friend}})},`;
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
