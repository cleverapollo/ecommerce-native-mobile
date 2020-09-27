import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListCreateUpdatePage } from './wish-list-create-update.page';

const routes: Routes = [
  {
    path: '',
    component: WishListCreateUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListNewPageRoutingModule {}
