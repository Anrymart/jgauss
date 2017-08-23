import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {HeaderComponent} from "./header/header.component";
import {NameListService} from "./spec-example/name-list.service";
import {FooterComponent} from "./footer/footer.component";
import {ImageModule} from "./image/image.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

const components: any = [
  HeaderComponent,
  FooterComponent
];

@NgModule({
  imports: [CommonModule, RouterModule, ImageModule],
  declarations: components,
  exports: components.concat(CommonModule, FormsModule, BrowserAnimationsModule, RouterModule, ImageModule)
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService]
    };
  }
}
