import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutComponent} from './about.component';
import {AboutRoutingModule} from './about-routing.module';
import {WebModule} from "../shared/web/web.module";

@NgModule({
  imports: [CommonModule, AboutRoutingModule, WebModule],
  declarations: [AboutComponent],
  exports: [AboutComponent]
})
export class AboutModule {
}
