import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsWishListOverviewPage } from './friends-wish-list-overview.page';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FriendsWishListOverviewPage
  },
  {
    path: 'friends-wish-list-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./../friends-wish-list-detail/friends-wish-list-detail.module').then( m => m.FriendsWishListDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsWishListOverviewPageRoutingModule {}
