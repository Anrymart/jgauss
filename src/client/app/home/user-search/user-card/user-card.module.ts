import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {UserCardComponent} from "./user-card.component";

@NgModule({
  imports: [SharedModule],
  declarations: [UserCardComponent],
  exports: [UserCardComponent]
})
export class UserCardModule {
}
