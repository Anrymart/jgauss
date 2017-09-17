import {NgModule} from "@angular/core";
import {UserCardModule} from "./user-card/user-card.module";
import {GraphModule} from "../../shared/graph/graph.module";
import {SearchResultComponent} from "./search-result.component";
import {NumeralModule} from "../../shared/numeral/numeral.module";
import {SocialIconModule} from "../../shared/social-icon/social-icon.module";
import {CommonModule} from "@angular/common";
import {ImageModule} from "../../shared/image/image.module";
import {BirthDateModule} from "../../shared/birth-date/birth-date.module";
import {ButtonGroupModule} from "../../shared/button-group/button-group.module";
import {VkDataService} from "../services/vk-data.sevice";
import {VkGraphSearchService} from "./graph-search/vk-graph-search.service";
import {GraphSearchService} from "../../shared/graph/graph-search.service";

@NgModule({
  imports: [
    CommonModule,
    ImageModule,
    GraphModule,
    UserCardModule,
    NumeralModule,
    SocialIconModule,
    BirthDateModule,
    ButtonGroupModule
  ],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
  providers: [VkDataService, {provide: 'GraphSearchService', useClass: VkGraphSearchService}]
})
export class SearchResultModule {
}
