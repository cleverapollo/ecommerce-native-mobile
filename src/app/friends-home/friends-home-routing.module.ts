import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FriendsWishListResolver } from '@friends/friends-wish-list-overview/friends-wish-list.resolver';
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
        resolve: { wishLists: FriendsWishListResolver },
        loadChildren: () => import('@friends/friends-wish-list-overview/friends-wish-list-overview.module').then( m => m.FriendsWishListOverviewPageModule)
      },
      {
        path: 'friends-wish-list-detail',
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
