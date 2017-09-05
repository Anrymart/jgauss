import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {VkAuthService} from "../services/vk-auth.sevice";
import {AuthFormModule} from "./auth-form/auth-form.module";
import {SearchResultModule} from "./search-result/search-result.module";
import {SearchFormModule} from "./search-form/search-form.module";
import {VkRoutingModule} from "./vk-routing.module";
import {VkComponent} from "./vk.component";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, VkRoutingModule, SearchFormModule, SearchResultModule, AuthFormModule],
  declarations: [VkComponent],
  exports: [VkComponent],
  providers: [VkAuthService]
})
export class VkModule {
}
