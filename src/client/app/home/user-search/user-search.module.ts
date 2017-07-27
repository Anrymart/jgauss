import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {UserSearchComponent} from "./user-search.component";
import {VkUserDataService} from "../services/vk-user-data.sevice";

@NgModule({
  imports: [SharedModule],
  declarations: [UserSearchComponent],
  exports: [UserSearchComponent],
  providers: [VkUserDataService]
})
export class UserSearchModule {
}
