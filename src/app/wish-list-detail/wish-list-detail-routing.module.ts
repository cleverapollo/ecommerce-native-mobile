import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListDetailPage } from './wish-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WishListDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListDetailPageRoutingModule {}
