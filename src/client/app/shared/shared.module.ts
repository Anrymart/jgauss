import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {ToolbarComponent} from "./toolbar/toolbar.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {NameListService} from "./name-list/name-list.service";
import {FooterComponent} from "./footer/footer.component";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

const components: any = [ToolbarComponent, NavbarComponent, FooterComponent];

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: components,
  exports: components.concat(CommonModule, FormsModule, RouterModule)
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService]
    };
  }
}
