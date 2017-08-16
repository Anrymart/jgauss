import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {VkDataService} from "../../../services/vk-data.sevice";
import {UserCardComponent} from "./user-card.component";

@NgModule({
  imports: [SharedModule],
  declarations: [UserCardComponent],
  exports: [UserCardComponent],
  providers: [VkDataService]
})
export class UserCardModule {
}
