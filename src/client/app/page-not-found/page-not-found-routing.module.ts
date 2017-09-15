import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '**', component: PageNotFoundComponent, data: {title: 'Страница не найдена'}},
    ])
  ],
  exports: [RouterModule]
})
export class PageNotFoundRoutingModule {
}
