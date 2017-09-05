import {NgModule} from "@angular/core";
import {SharedModule} from "../../shared/shared.module";
import {UserCardModule} from "./user-card/user-card.module";
import {GraphModule} from "./graph/graph.module";
import {VkDataService} from "../../services/vk-data.sevice";
import {SearchResultComponent} from "./search-result.component";
import {NumeralModule} from "../../shared/numeral/numeral.module";
import {SocialIconModule} from "../../shared/social-icon/social-icon.module";

@NgModule({
  imports: [SharedModule, GraphModule, UserCardModule, NumeralModule, SocialIconModule],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
  providers: [VkDataService]
})
export class SearchResultModule {
}
