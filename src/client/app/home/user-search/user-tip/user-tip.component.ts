import {Component} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'jg-user-tip',
  templateUrl: 'user-tip.component.html',
  styleUrls: ['user-tip.component.css'],
  host: {'[class._visible]': 'visible'}
})
export class UserTipComponent {
}
