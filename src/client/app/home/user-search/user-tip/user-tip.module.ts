import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {UserTipComponent} from "./user-tip.component";

@NgModule({
  imports: [SharedModule],
  declarations: [UserTipComponent],
  exports: [UserTipComponent]
})
export class UserTipModule {
}
