import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FooterComponent} from "./footer.component";
import {RouterModule} from "@angular/router";
import {ImageModule} from "../image/image.module";

@NgModule({
  imports: [CommonModule, RouterModule, ImageModule],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {
}
