import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListCreatePage } from './wish-list-create.page';

const routes: Routes = [
  {
    path: '',
    component: WishListCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListCreatePageRoutingModule {}
