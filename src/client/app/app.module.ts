import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AboutModule} from './about/about.module';
import {HomeModule} from './home/home.module';
import {VkModule} from './vk/vk.module';
import {SharedModule} from './shared/shared.module';
import {VkDataService} from "./vk/services/vk-data.sevice";
import {VkAuthService} from "./vk/services/vk-auth.sevice";
import {PageNotFoundModule} from "./page-not-found/page-not-found.module";
import {HeaderModule} from "./shared/header/header.module";
import {FooterModule} from "./shared/footer/footer.module";

@NgModule({
  imports: [BrowserModule, AppRoutingModule, SharedModule,
    AboutModule, HomeModule, VkModule, PageNotFoundModule, HeaderModule, FooterModule],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
    VkDataService,
    VkAuthService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
