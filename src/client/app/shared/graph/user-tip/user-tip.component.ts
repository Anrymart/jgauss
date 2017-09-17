import {ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core";
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
    afterChange() {
      this.updatePosition();
      this._imageLoaded = false;
    }
  })
  @Input()
  userData: any;

  @PropertyHandler({
    afterChange() {
      this.updatePosition();
    }
  })
  @Input()
  visible: boolean;

  _imageLoaded: boolean;

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  private updatePosition() {
    if (this.userData) {
      let elementStyle = this.elementRef.nativeElement.style;
      elementStyle.left = this.userData.event.offsetX + "px";
      elementStyle.top = this.userData.event.offsetY + "px";
    }
  }

  _onLoad() {
    this._imageLoaded = true;
    this.changeDetectorRef.detectChanges();
  }
}
