import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {VkComponent} from "./vk/vk.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      // {path: '', component: HomeComponent, pathMatch: 'full'},
      // {path: 'about', component: AboutComponent},
      // {path: 'vk/:id', component: VkComponent},
      // {path: '**', component: PageNotFoundComponent}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

