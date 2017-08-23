import {NgModule} from "@angular/core";
import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";
import {SharedModule} from "../shared/shared.module";
import {VkAuthService} from "../services/vk-auth.sevice";
import {AuthFormModule} from "./auth-form/auth-form.module";
import {SearchResultModule} from "./search-result/search-result.module";
import {SearchFormModule} from "./search-form/search-form.module";

@NgModule({
  imports: [HomeRoutingModule, SharedModule, SearchFormModule, SearchResultModule, AuthFormModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: [VkAuthService]
})
export class HomeModule {
}
