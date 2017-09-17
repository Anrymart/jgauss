import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {GraphModule} from "../shared/graph/graph.module";
import {HomeGraphSearchService} from "./graph-search/home-graph-search.service";

@NgModule({
  imports: [CommonModule, HomeRoutingModule, GraphModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [{provide: 'GraphSearchService', useClass: HomeGraphSearchService}]
})
export class HomeModule {
}
