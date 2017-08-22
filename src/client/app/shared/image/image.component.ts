import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PropertyHandler} from "../../util/property-handler";

@Component({
  moduleId: module.id,
  selector: 'jg-image',
  templateUrl: 'image.component.html',
  styleUrls: ['image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'[class._visible]': '_loaded'}
})
export class ImageComponent {

  @PropertyHandler({
    afterChange() {
      this._loaded = false;
    }
  })
  @Input()
  src: string;

  @Input()
  parentSize: boolean = false;

  @Input()
  styleClass: string;

  _loaded: boolean = false;

  _onLoad(): void {
    this._loaded = true;
  }
}
