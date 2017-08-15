import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {UserSearchComponent} from "./user-search.component";
import {VkDataService} from "../services/vk-data.sevice";

@NgModule({
  imports: [SharedModule],
  declarations: [UserSearchComponent],
  exports: [UserSearchComponent],
  providers: [VkDataService]
})
export class UserSearchModule {
}
