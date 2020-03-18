import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsWishListOverviewPage } from './friends-wish-list-overview.page';

const routes: Routes = [
  {
    path: '',
    component: FriendsWishListOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsWishListOverviewPageRoutingModule {}
