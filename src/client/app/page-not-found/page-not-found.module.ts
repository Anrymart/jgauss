import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from "./page-not-found.component";
import {PageNotFoundRoutingModule} from "./page-not-found-routing.module";
import {WebModule} from "../shared/web/web.module";

@NgModule({
  imports: [CommonModule, PageNotFoundRoutingModule, WebModule],
  declarations: [PageNotFoundComponent],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {
}
