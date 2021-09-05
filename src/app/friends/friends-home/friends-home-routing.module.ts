import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

import { FriendsHomePage } from './friends-home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'friends-wish-list-overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: FriendsHomePage,
    children: [
      {
        path: 'friends-wish-list-overview',
        canActivate: [AuthGuard],
        loadChildren: () => import('@friends/friends-wish-list-overview/friends-wish-list-overview.module').then( m => m.FriendsWishListOverviewPageModule)
      },
      {
        path: 'wish-list/:wishListId',
        canActivate: [AuthGuard],
        loadChildren: () => import('@friends/friends-wish-list-detail/friends-wish-list-detail.module').then( m => m.FriendsWishListDetailPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsHomePageRoutingModule {}
