import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsWishListOverviewPage } from '@friends/friends-wish-list-overview/friends-wish-list-overview.page';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FriendsWishListOverviewPage
  },
  {
    path: 'friends-wish-list-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('@friends/friends-wish-list-detail/friends-wish-list-detail.module')
      .then( m => m.FriendsWishListDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsWishListOverviewPageRoutingModule {}
