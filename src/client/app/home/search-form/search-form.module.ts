import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {SearchFormComponent} from "./search-form.component";

@NgModule({
  imports: [SharedModule],
  declarations: [SearchFormComponent],
  exports: [SearchFormComponent]
})
export class SearchFormModule {
}
