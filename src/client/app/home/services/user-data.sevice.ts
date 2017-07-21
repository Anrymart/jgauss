import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

declare const VK: any;

@Injectable
export class UserDataService {

  constructor(private http: Http) {

  }

  getUserData(user: string): Promise {
    return Promise.resolve({});
  }
}
