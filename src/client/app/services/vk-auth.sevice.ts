import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {VkOpenApi} from "../../../types/vk";

declare const VK: VkOpenApi;

@Injectable()
export class VkAuthService {

  //todo: clarify type
  public sessionChange: Observable<any>;

  constructor() {
    this.getLoginStatus();
    // this.initSubscription();
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

  private initSubscription(): void {
    this.sessionChange = Observable.create((observer: Observer<any>) => {
      VK.Observer.subscribe(observer.next, 'auth.sessionChange');
    });
  }
}
