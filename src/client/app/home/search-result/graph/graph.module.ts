import {NgModule} from "@angular/core";
import {GraphComponent} from "./graph.component";
import {SharedModule} from "../../../shared/shared.module";
import {UserTipModule} from "../user-tip/user-tip.module";
import {ResizeModule} from "../../../shared/resize/resize.module";
import {GraphToolbarModule} from "../graph-toolbar/graph-toolbar.module";

@NgModule({
  imports: [SharedModule, UserTipModule, ResizeModule, GraphToolbarModule],
  declarations: [GraphComponent],
  exports: [GraphComponent]
})
export class GraphModule {
}
