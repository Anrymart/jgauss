import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PropertyHandler} from "../../../util/property-handler";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";

@Component({
  moduleId: module.id,
  selector: 'jg-user-card',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        animate(300, keyframes([
          style({opacity: 0, offset: 0}),
          style({opacity: 1, offset: 1})
        ]))
      ]),
      transition('* => void', [
        animate(200, keyframes([
          style({opacity: 1, offset: 0}),
          style({opacity: 0, offset: 1}),
        ]))
      ])
    ])
  ]
})
export class UserCardComponent {

  @PropertyHandler({
    afterChange(value) {
      if (!value) {
        this.visible = false;
      }
    }
  })
  @Input()
  userData: any;

  @Input()
  visible: boolean = false;

  @Output()
  onFriendsShow: EventEmitter<any> = new EventEmitter<any>();

  _userCardData: any[];

  constructor() {
  }

  show(userData: any): void {
    this.visible = true;
    this.userData = userData;
    this._userCardData = Object.keys(userData).map((key: string) => {
      return {key: key, value: JSON.stringify(userData[key])};
    });
  }
}
