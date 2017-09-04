import {Injectable} from "@angular/core";
import {VkOpenApi} from "../../../types/vk";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

declare const VK: VkOpenApi;

@Injectable()
export class VkDataService {

  private static USER_FIELDS = 'photo_id, verified, sex, bdate, city, country, home_town, has_photo,' +
    ' photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig,' +
    ' online, domain, has_mobile, contacts, site, education, universities, schools, status, last_seen,' +
    ' followers_count, common_count, occupation, nickname, relatives, relation, personal,' +
    ' connections, exports, wall_comments, activities, interests, music, movies, tv, books, games,' +
    ' about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message,' +
    ' can_send_friend_request, is_favorite, is_hidden_from_feed, timezone, screen_name,' +
    ' maiden_name, crop_photo, is_friend, friend_status, career, military, blacklisted, blacklisted_by_me';

  private static FRIENDS_FIELDS = 'nickname, domain, sex, bdate, city, country, timezone, photo_50, photo_100,' +
    ' photo_200_orig, has_mobile, contacts, education, online, relation, last_seen, status,' +
    ' can_write_private_message, can_see_all_posts, can_post, universities';

  /**
   * Searches user for given query. Query can be a src, user id or short name.
   *
   * @param {string} query
   * @returns {Promise<any>}
   */
  getUser(query?: string): Promise<any> {

    //check if query is src
    let linkRegExp = /vk.com\/([^?/]*)/;
    let domainQueryResult = linkRegExp.exec(query);

    let getUserByDomain = (domain: string): any => {
      return new Promise((resolve) => {
        VK.Api.call('users.get', {
          user_ids: [domain],
          fields: VkDataService.USER_FIELDS
        }, function handleResponse({response}: any) {
          return resolve(response[0]);
        });
      });
    };

    if (domainQueryResult) {
      //query is src-like
      return getUserByDomain(domainQueryResult[1]);
    }

    //query is not src-like
    return getUserByDomain(query);
  }

  getUserFriends(params?: any): Promise<any> {
    return new Promise((resolve) => {
      if (params.fields == '*') {
        params.fields = VkDataService.FRIENDS_FIELDS;
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

  getCitiesById(cityIds: number[]): Promise<VkCity[]> {
    return new Promise((resolve) => {
      VK.Api.call('database.getCitiesById', {city_ids: cityIds},
        function handleResponse({response}: any) {
          resolve(response);
        });
    });
  }
}

export interface VkCity {
  cid: number;
  name: string;
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
