import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsWishListDetailPage } from './friends-wish-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsWishListDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsWishListDetailPageRoutingModule {}
