import {NgModule} from "@angular/core";
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
import {SharedModule} from "../shared/shared.module";
import {GraphModule} from "./graph/graph.module";
import {UserSearchModule} from "./user-search/user-search.module";
import {VkAuthService} from "./services/vk-auth.sevice";
import {AuthFormModule} from "./auth-form/auth-form.module";

@NgModule({
  imports: [HomeRoutingModule, SharedModule, GraphModule, UserSearchModule, AuthFormModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [VkAuthService]
})
export class HomeModule {
}
