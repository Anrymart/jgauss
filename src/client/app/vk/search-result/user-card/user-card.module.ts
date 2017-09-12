import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {UserCardComponent} from "./user-card.component";
import {SocialIconModule} from "../../../shared/social-icon/social-icon.module";
import {BirthDateModule} from "../../../shared/birth-date/birth-date.module";

@NgModule({
  imports: [SharedModule, SocialIconModule, BirthDateModule],
  declarations: [UserCardComponent],
  exports: [UserCardComponent]
})
export class UserCardModule {
}
