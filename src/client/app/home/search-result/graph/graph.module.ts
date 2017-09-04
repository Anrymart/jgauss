import {NgModule} from "@angular/core";
import {GraphComponent} from "./graph.component";
import {SharedModule} from "../../../shared/shared.module";
import {UserTipModule} from "../user-tip/user-tip.module";
import {ResizeModule} from "../../../shared/resize/resize.module";
import {GraphToolbarModule} from "../graph-toolbar/graph-toolbar.module";
import {GraphSearchService} from "./graph-search.service";
import {ButtonGroupModule} from "../../../shared/button-group/button-group.module";

@NgModule({
  imports: [SharedModule, UserTipModule, ResizeModule, GraphToolbarModule, ButtonGroupModule],
  declarations: [GraphComponent],
  exports: [GraphComponent],
  providers: [GraphSearchService]
})
export class GraphModule {
}
