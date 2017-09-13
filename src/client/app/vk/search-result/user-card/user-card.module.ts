import {NgModule} from "@angular/core";
import {UserCardComponent} from "./user-card.component";
import {SocialIconModule} from "../../../shared/social-icon/social-icon.module";
import {BirthDateModule} from "../../../shared/birth-date/birth-date.module";
import {ImageModule} from "../../../shared/image/image.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [CommonModule, RouterModule, ImageModule, SocialIconModule, BirthDateModule],
  declarations: [UserCardComponent],
  exports: [UserCardComponent]
})
export class UserCardModule {
}
