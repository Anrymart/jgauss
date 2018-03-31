import {Injectable, NgZone} from "@angular/core";
import {VkCity, VkOpenApi, VkResponse} from "../types/vk";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

declare const VK: VkOpenApi;

@Injectable()
export class VkDataService {

  public static readonly FRIENDS_FIELDS = 'nickname, domain, sex, bdate, city, country, timezone, photo_50, photo_100,' +
    ' photo_200_orig, has_mobile, contacts, education, online, relation, last_seen, status,' +
    ' can_write_private_message, can_see_all_posts, can_post, universities';

  private static readonly USER_FIELDS = 'photo_id, verified, sex, bdate, city, country, home_town, has_photo,' +
    ' photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig,' +
    ' online, domain, has_mobile, contacts, site, education, universities, schools, status, last_seen,' +
    ' followers_count, common_count, occupation, nickname, relatives, relation, personal,' +
    ' connections, exports, wall_comments, activities, interests, music, movies, tv, books, games,' +
    ' about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message,' +
    ' can_send_friend_request, is_favorite, is_hidden_from_feed, timezone, screen_name,' +
    ' maiden_name, crop_photo, is_friend, friend_status, career, military, blacklisted, blacklisted_by_me';

  private static readonly API_VERSION = '5.73';


  constructor(private zone: NgZone) {
  }

  /**
   * Searches user for given query. Query can be a url, user id or short name.
   *
   * @param {string} query
   * @returns {Promise<any>}
   */
  getUser(query?: string): Promise<any> {

    //check if query is url
    let linkRegExp = /vk.com\/([^?/]*)/;
    let domainQueryResult = linkRegExp.exec(query);

    let getUserByDomain = (domain: string): any => {
      return this.promisifyRequest(function (handleResponse) {
        let params: any = {
          fields: VkDataService.USER_FIELDS,
          v: VkDataService.API_VERSION
        };
        if (domain) {
          params.user_ids = domain;
        }
        VK.Api.call('users.get', params, handleResponse);
      }).then((users: any) => {
        return users[0];
      });
    };

    if (domainQueryResult) {
      //query is url-like
      return getUserByDomain(domainQueryResult[1]);
    }

    //query is not url-like
    return getUserByDomain(query);
  }

  getUserFriends(params?: any): Promise<any> {
    return this.promisifyRequest(function (handleResponse) {
      params.v = params.v || VkDataService.API_VERSION;
      VK.Api.call('friends.get', params, handleResponse);
    });
  }

  /**
   * @returns {any}
   * @param userList
   */
  getSocialInfo(userList: Array<number | string>): Observable<any> {
    let requests = [];

    const step = 25;
    for (let i = 0; i < userList.length; i += step) {

      let requestCode = userList.slice(i, i + step).reduce(function reducer(code: string, friend: any) {
        return code + `{id:${friend},l:API.friends.get({user_id:${friend}})},`;
      }, '');

      requests.push(function makeRequest(handleResponse: Function) {
        VK.Api.call('execute',
          {
            code: `return [${requestCode}];`,
            v: VkDataService.API_VERSION
          },
          handleResponse);
      });
    }

    return this.observableRequests(requests);
  }

  getCitiesById(cityIds: number[]): Promise<VkCity[]> {
    return this.promisifyRequest(function (handleResponse) {
      VK.Api.call('database.getCitiesById',
        {
          city_ids: cityIds,
          v: VkDataService.API_VERSION
        }, handleResponse);
    });
  }

  async getFriendLikesCount(userId: number): Promise<any> {
    let [posts, photos] = await Promise.all([this.getWallPosts(userId), this.getPhotos(userId)]);
    posts = posts.items;
    photos = photos.items;

    let requests: ((handleResponse: Function) => void)[] = [];

    const step = 25;
    for (let i = 0; i < posts.length; i += step) {
      let requestCode = posts.slice(i, i + step).reduce(function reducer(code: string, post: any) {
        if (post.id) {
          return code + `{id:${post.id},l:API.likes.getList({type:"post",item_id:${post.id},owner_id:${userId},count:1000}).items},`;
        }
        return code;
      }, '');

      requests.push(function makeRequest(handleResponse: Function) {
        VK.Api.call('execute',
          {
            code: `return [${requestCode}];`,
            v: VkDataService.API_VERSION
          }, handleResponse);
      });
    }

    for (let i = 0; i < photos.length; i += step) {
      let requestCode = photos.slice(i, i + step).reduce(function reducer(code: string, photo: any) {
        if (photo.id) {
          return code + `{id:${photo.id},l:API.likes.getList({type:"photo",item_id:${photo.id},owner_id:${userId},count:1000}).items},`;
        }
        return code;
      }, '');

      requests.push(function makeRequest(handleResponse: Function) {
        VK.Api.call('execute',
          {
            code: `return [${requestCode}];`,
            v: VkDataService.API_VERSION
          }, handleResponse);
      });
    }

    let likes: any = {};

    return new Promise((resolve) => {
      this.observableRequests(requests).subscribe(function next(data: any) {
        data.forEach((object: { l: number[] }) => {
          object.l.forEach((userId: number) => {
            if (!likes[userId]) {
              likes[userId] = 0;
            }
            likes[userId]++;
            likes.max = Math.max(likes.max || 0, likes[userId]);
          });
        })
      }, null, function complete() {
        resolve(likes);
      });
    });

  }

  private getWallPosts(userId: number): Promise<any> {
    return this.promisifyRequest(function (handleResponse) {
      VK.Api.call('wall.get', {
        owner_id: userId,
        filter: 'owner',
        v: VkDataService.API_VERSION
      }, handleResponse);
    });
  }

  private getPhotos(userId: number): Promise<any> {
    return this.promisifyRequest(function (handleResponse) {
      VK.Api.call('photos.getAll', {
        owner_id: userId,
        v: VkDataService.API_VERSION
      }, handleResponse);
    });
  }

  private promisifyRequest<T>(makeRequest: (handleResponse: Function) => void): Promise<T> {
    return new Promise((resolve, reject) => {

      let handleResponse = (response: VkResponse) => {
        if (response.response) {
          resolve(response.response);
          return;
        }

        // too-many-requests error
        if (response.error && response.error.error_code == 6) {
          makeRequest(handleResponse);
          return;
        }

        // another error
        console.log(response.error);
        reject(response.error);
      };

      makeRequest(handleResponse);
    });
  }

  private observableRequests<T>(requests: ((handleResponse: Function) => void)[]): Observable<T> {
    const INTERVAL = 100;

    let successfulRequest = 0;
    let requestQueue: Function[] = [];

    let timerId: number;

    this.zone.runOutsideAngular(() => {
      timerId = +setInterval(() => {
        if (requestQueue.length) {
          requestQueue.shift()();
        }
      }, INTERVAL);
    });

    return Observable.create((observer: Observer<any>) => {

      for (let makeRequest of requests) {
        let handleResponse = (response: VkResponse) => {

          // correct response
          if (response.response) {
            observer.next(response.response);
            if (++successfulRequest == requests.length) {
              observer.complete();
              clearInterval(timerId);
            }
            return;
          }

          // too-many-requests error
          if (response.error && response.error.error_code == 6) {
            requestQueue.push(function () {
              makeRequest(handleResponse);
            });
            return;
          }

          // another error
          console.log(response.error);
        };

        makeRequest(handleResponse);
      }
    });
  }
}
