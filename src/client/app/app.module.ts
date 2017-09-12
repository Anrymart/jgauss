import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AboutModule} from './about/about.module';
import {HomeModule} from './home/home.module';
import {VkModule} from './vk/vk.module';
import {SharedModule} from './shared/shared.module';
import {VkDataService} from "./vk/services/vk-data.sevice";
import {VkAuthService} from "./vk/services/vk-auth.sevice";
import {PageNotFoundModule} from "./page-not-found/page-not-found.module";

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, SharedModule.forRoot(),
    AboutModule, HomeModule, PageNotFoundModule, VkModule],
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
