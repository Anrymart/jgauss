import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebComponent} from "./web.component";

@NgModule({
  imports: [CommonModule],
  declarations: [WebComponent],
  exports: [WebComponent]
})
export class WebModule {
}
