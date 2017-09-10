import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {UserCardComponent} from "./user-card.component";
import {SocialIconModule} from "../../../shared/social-icon/social-icon.module";

@NgModule({
  imports: [SharedModule, SocialIconModule],
  declarations: [UserCardComponent],
  exports: [UserCardComponent]
})
export class UserCardModule {
}
