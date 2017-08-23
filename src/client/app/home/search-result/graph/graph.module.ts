import {NgModule} from "@angular/core";
import {GraphComponent} from "./graph.component";
import {SharedModule} from "../../../shared/shared.module";
import {UserTipModule} from "../user-tip/user-tip.module";

@NgModule({
  imports: [SharedModule, UserTipModule],
  declarations: [GraphComponent],
  exports: [GraphComponent]
})
export class GraphModule {
}
