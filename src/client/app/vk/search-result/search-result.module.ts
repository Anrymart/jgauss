import {NgModule} from "@angular/core";
import {UserCardModule} from "./user-card/user-card.module";
import {GraphModule} from "./graph/graph.module";
import {VkDataService} from "../services/vk-data.sevice";
import {SearchResultComponent} from "./search-result.component";
import {NumeralModule} from "../../shared/numeral/numeral.module";
import {SocialIconModule} from "../../shared/social-icon/social-icon.module";
import {CommonModule} from "@angular/common";
import {ImageModule} from "../../shared/image/image.module";
import {BirthDateModule} from "../../shared/birth-date/birth-date.module";

@NgModule({
  imports: [CommonModule, ImageModule, GraphModule, UserCardModule, NumeralModule, SocialIconModule, BirthDateModule],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
  providers: [VkDataService]
})
export class SearchResultModule {
}
