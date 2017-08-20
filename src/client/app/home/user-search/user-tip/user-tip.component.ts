import {Component, ElementRef, Input} from "@angular/core";
import {PropertyHandler} from "../../../util/property-handler";

@Component({
  moduleId: module.id,
  selector: 'jg-user-tip',
  templateUrl: 'user-tip.component.html',
  styleUrls: ['user-tip.component.css'],
  host: {'[class._visible]': 'visible'}
})
export class UserTipComponent {

  @PropertyHandler({
    afterChange(userData: any) {
      let elementStyle = this.elementRef.nativeElement.style;
      let shift = 5;
      elementStyle.left = userData.x + shift + "px";
      elementStyle.top = userData.y - 36 - shift + "px";
    }
  })
  @Input()
  userData: any;

  @Input()
  visible: boolean;

  constructor(private elementRef: ElementRef) {
  }
}
