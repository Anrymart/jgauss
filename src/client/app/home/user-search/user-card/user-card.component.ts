import {Component, Input} from "@angular/core";
import {PropertyHandler} from "../../../util/property-handler";

@Component({
  moduleId: module.id,
  selector: 'jg-user-card',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.css'],
  host: {'[class._visible]': 'visible'}
})
export class UserCardComponent {

  @PropertyHandler({
    afterChange: function (userData: any) {
      if (userData) {
        this.visible = true;
      }
      this._userCardData = Object.keys(userData).map((key: string) => {
        return {key: key, value: JSON.stringify(userData[key])};
      });
    }
  })
  @Input()
  userData: any;

  @Input()
  visible: boolean = false;

  _userCardData: any[];
}
