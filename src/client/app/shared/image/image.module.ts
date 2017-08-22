import {NgModule} from "@angular/core";
import {ImageComponent} from "./image.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [ImageComponent],
  exports: [ImageComponent]
})
export class ImageModule {
}
