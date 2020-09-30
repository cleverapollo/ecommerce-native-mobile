import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthGuard } from '@guards/auth.guard';
import { FriendSelectOptionsResolver } from '@wishLists/wish-list-create-update/friend-list-select-options.resolver';
import { WishListSelectOptionsResolver } from '@wishLists/wish-create-update/wish-list-select-options.resolver';
import { WishListResolver } from './wish-list.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wish-list-overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'wish-list-overview',
        canActivate: [AuthGuard],
        resolve: { wishLists: WishListResolver },
        loadChildren: () => import('@wishLists/wish-list-overview/wish-list-overview.module').then( m => m.WishListOverviewPageModule)
      },
      {
        path: 'wish-list-new',
        canActivate: [AuthGuard], // RoleGuard
        resolve: { friends: FriendSelectOptionsResolver },
        loadChildren: () => import('@wishLists/wish-list-create-update/wish-list-create-update.module').then( m => m.WishListCreateUpdatePageModule)
      },
      {
        path: 'wish-list-detail',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
      },
      {
        path: 'wish-search-selection',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-search-selection/wish-search-selection.module').then( m => m.WishSearchSelectionPageModule)
      },
      {
        path: 'wish-new',
        canActivate: [AuthGuard],  // RoleGuard
        resolve: { wishListSelectOptions: WishListSelectOptionsResolver },
        loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
