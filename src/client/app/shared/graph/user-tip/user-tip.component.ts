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
  tipData: TipData;

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
    if (this.tipData.user) {
      let elementStyle = this.elementRef.nativeElement.style;
      let event = this.tipData.event;
      elementStyle.left = event.pageX + "px";
      elementStyle.top = event.pageY + "px";
    }
  }

  _onLoad() {
    this._imageLoaded = true;
    this.changeDetectorRef.detectChanges();
  }
}

export interface TipData {
  user?: any;
  event?: any;
}
