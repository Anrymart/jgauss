import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: ':id', component: HomeComponent},
      {path: '', redirectTo: '/go', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
