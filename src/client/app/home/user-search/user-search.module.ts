import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {UserSearchComponent} from "./user-search.component";
import {UserCardModule} from "./user-card/user-card.module";
import {GraphModule} from "./graph/graph.module";
import {VkDataService} from "../../services/vk-data.sevice";

@NgModule({
  imports: [SharedModule, GraphModule, UserCardModule],
  declarations: [UserSearchComponent],
  exports: [UserSearchComponent],
  providers: [VkDataService]
})
export class UserSearchModule {
}
