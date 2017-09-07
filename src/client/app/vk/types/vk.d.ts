// Type definitions for VK Open API

export interface VkOpenApi {
  init: (config: VkInitConfig) => void;
  Auth: VkAuth;
  Api: VkApi;
  Widgets: VkWidgets;
  Observer: VkObserver;
}

export interface VkInitConfig {
  apiId: number;
  status?: boolean;
  onlyWidgets?: boolean;
}

export interface VkAuth {
  login(callback?: (data: { session: VkAuthUserSession, status: VkAuthUserStatus }) => void,
        settings?: number): void;

  logout(callback?: (data: { session: null, status: "unknown", settings: undefined }) => void): void;

  revokeGrants(callback?: (data: { session: null, status: "unknown", settings: undefined }) => void): void;

  getLoginStatus(callback?: (data: { session: VkAuthUserSession, status: VkAuthUserStatus }) => void): void;

  getSession(callback?: (session: VkAuthUserSession) => void): void;
}

export interface VkAuthUserSession {
  /**
   * Time in Unixtime format, defines time when session is over.
   */
  expire: number;
  mid: number;
  secret: string;
  sid: string;
  sig: string;
  user: VkAuthUser
}

export interface VkAuthUser {
  /**
   * Short page address
   */
  domain: string;

  first_name: string;

  /**
   * Page src in `https://vk.com/domain` format
   */
  href: string;

  id: string;

  last_name: string;

  /**
   * Patronymic or nickname (if specified)
   */
  nickname: string;
}

export declare type VkAuthUserStatus = "connected" | "not_authorized" | "unknown";


export interface VkApi {
  call(method: string, params: { [key: string]: any }, callback: Function): void;
}

export interface VkWidgets {
  ContactUs: any;
  Comments: any;
  Post: any;
  Group: any;
  Like: any;
  Recommended: any;
  Poll: any;
  Auth: any;
  Subscribe: any;
}

export interface VkObserver {
  subscribe(event: VkObservableEventType, handler: Function): void;

  unsubscribe(event: VkObservableEventType, handler: Function): void;
}

export declare type VkObservableEventType =
  "auth.login" |
  "auth.logout" |
  "auth.statusChange" |
  "auth.sessionChange" |
  "widgets.comments.new_comment" |
  "widgets.comments.delete_comment" |
  "widgets.groups.joined" |
  "widgets.groups.leaved" |
  "widgets.like.liked" |
  "widgets.like.unliked" |
  "widgets.like.shared" |
  "widgets.like.unshared" |
  "widgets.subscribed" |
  "widgets.unsubscribed";

export interface VkResponse {
  error?: { error_code: number };
  response?: any;
}

export interface VkCity {
  cid: number;
  name: string;
}
