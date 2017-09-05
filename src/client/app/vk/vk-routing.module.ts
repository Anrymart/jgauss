import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {VkComponent} from './vk.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'vk/:id', component: VkComponent},
      {path: 'vk', redirectTo: '/vk/go', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class VkRoutingModule {
}
