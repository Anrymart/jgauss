// Type definitions for VK Open API

export interface VK {
  init: (config: VkInitConfig) => void;
  Auth: VkAuth;
  Api: VkApi;
  Widgets: VkWidgets;
  Observer: VkObserver;
}

interface VkInitConfig {
  apiId: number;
  status?: boolean;
  onlyWidgets?: boolean;
}

interface VkAuth {
  login(callback?: (data: { session: VkUserSession, status: VkUserStatus }) => void,
        settings?: number);

  logout(callback: Function);

  revokeGrants(callback: Function);

  getLoginStatus(callback: Function);

  getSession(callback: Function);
}

interface VkUserSession {
  /**
   * Time in Unixtime format, when session is over.
   */
  expire: number;
  mid: number;
  secret: string;
  sid: string;
  sig: string;
  user: {
    domain: string;
    first_name: string;
    href: string;
    id: string;
    last_name: string;
    nickname: string;
  }
}

declare type VkUserStatus = "connected" | "not_authorized" | "unknown";

interface VkApi {
  call(method: string, params: { [key: string] }, callback: Function);
}

interface VkWidgets {
  ContactUs;
  Comments;
  Post;
  Group;
  Like;
  Recommended;
  Poll;
  Auth;
  Subscribe;
}

interface VkObserver {
  subscribe(handler: Function, event: VkObservableEventType);

  unsubscribe(handler: Function, event: VkObservableEventType);
}

declare type VkObservableEventType =
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
