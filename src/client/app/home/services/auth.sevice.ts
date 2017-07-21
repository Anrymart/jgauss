import {Injectable} from "@angular/core";

declare const VK: any;

@Injectable()
export class VkAuthService {

  constructor() {
    this.getLoginStatus();
  }

  login(callback?: Function, settings?: number): void {
    VK.Auth.login(callback, settings);
  }

  logout(callback?: Function): void {
    VK.Auth.logout(callback);
  }

  getSession() {

  }

  isAuthorized(): boolean {
    return !!VK.Auth.getSession();
  }

  getLoginStatus(): Promise<{ session, status }> {
    return new Promise(function (resolve: (value) => void, reject: (reason) => void) {
      VK.Auth.getLoginStatus(resolve);
    });
  }

}
