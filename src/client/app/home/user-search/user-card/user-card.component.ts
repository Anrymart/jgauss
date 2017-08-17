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
    afterChange: function (value: any) {
      if (value) {
        this.visible = true;
      }
      this._userDataKeys = Object.keys(value);
    }
  })
  @Input()
  userData: any;

  @Input()
  visible: boolean = false;

  _userDataKeys: string[];
}
