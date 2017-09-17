import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {VkGraphSearchService} from "../vk/search-result/graph-search/vk-graph-search.service";
import {GraphModule} from "../shared/graph/graph.module";

@NgModule({
  imports: [CommonModule, HomeRoutingModule, GraphModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [{provide: 'GraphSearchService', useClass: VkGraphSearchService}]
})
export class HomeModule {
}
