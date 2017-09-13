import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./header.component";
import {RouterModule} from "@angular/router";
import {ImageModule} from "../image/image.module";

@NgModule({
  imports: [CommonModule, RouterModule, ImageModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
