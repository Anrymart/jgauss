import {NgModule} from "@angular/core";
import {GraphComponent} from "./graph.component";
import {UserTipModule} from "./user-tip/user-tip.module";
import {ResizeModule} from "../resize/resize.module";
import {GraphToolbarModule} from "./graph-toolbar/graph-toolbar.module";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, UserTipModule, ResizeModule, GraphToolbarModule],
  declarations: [GraphComponent],
  exports: [GraphComponent]
})
export class GraphModule {
}
