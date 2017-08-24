import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {GraphToolbarComponent} from "./graph-toolbar.component";

@NgModule({
  imports: [SharedModule],
  declarations: [GraphToolbarComponent],
  exports: [GraphToolbarComponent]
})
export class GraphToolbarModule {
}
