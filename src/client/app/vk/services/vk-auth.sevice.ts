import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {VkOpenApi} from "../types/vk";

declare const VK: VkOpenApi;

@Injectable()
export class VkAuthService {

  private sessionChange: Observable<any>;

  constructor() {
    this.getLoginStatus();
  }

  getSessionChange(): Observable<any> {
    if (!this.sessionChange) {
      this.sessionChange = Observable.create((observer: Observer<any>) => {
        let subscriber = (status: any) => {
          observer.next(status);
        };
        VK.Observer.subscribe('auth.sessionChange', subscriber);
      });
    }
    return this.sessionChange;
  }

  login(callback?: any, settings?: number): void {
    VK.Auth.login(callback, settings);
  }

  logout(callback?: any): void {
    VK.Auth.logout(callback);
  }

  isAuthorized(): boolean {
    return !!VK.Auth.getSession();
  }

  getLoginStatus(): Promise<{ session: any, status: any }> {
    return new Promise(function (resolve: (value: any) => void, reject: (reason: any) => void) {
      VK.Auth.getLoginStatus(resolve);
    });
  }

}
