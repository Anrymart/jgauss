import {NgModule} from "@angular/core";
import {GraphComponent} from "./graph.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [SharedModule],
  declarations: [GraphComponent],
  exports: [GraphComponent]
})
export class GraphModule {
}
