import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListDetailPage } from './wish-list-detail.page';
import { AuthGuard } from '@guards/auth.guard';
import { WishResolver } from '@wishLists/home/wish.resolver';

const routes: Routes = [
  {
    path: '',
    component: WishListDetailPage
  },
  {
    path: 'wish/:wishId',
    canActivate: [AuthGuard],
    resolve: { wish: WishResolver },
    loadChildren: () => import('@wishLists/wish-detail/wish-detail.module')
      .then( m => m.WishDetailPageModule)
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-list-create-update/wish-list-create-update.module')
      .then( m => m.WishListCreateUpdatePageModule)
  },
  {
    path: 'wish-search',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishSearch/pages/wish-search-overview/wish-search-overview.module')
      .then( m => m.WishSearchSelectionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListDetailPageRoutingModule {}
