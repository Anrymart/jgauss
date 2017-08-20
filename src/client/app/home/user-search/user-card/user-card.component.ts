import {Component, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'jg-user-card',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.css'],
  host: {'[class._visible]': 'visible'}
})
export class UserCardComponent {

  @Input()
  userData: any;

  @Input()
  visible: boolean = false;

  _userCardData: any[];

  show(userData: any): void {
    this.visible = true;
    this.userData = userData;
    this._userCardData = Object.keys(userData).map((key: string) => {
      return {key: key, value: JSON.stringify(userData[key])};
    });
  }
}
