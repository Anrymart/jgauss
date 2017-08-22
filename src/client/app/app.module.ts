import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AboutModule} from './about/about.module';
import {HomeModule} from './home/home.module';
import {SharedModule} from './shared/shared.module';
import {VkDataService} from "./services/vk-data.sevice";
import {VkAuthService} from "./services/vk-auth.sevice";

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, AboutModule, HomeModule, SharedModule.forRoot()],
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
