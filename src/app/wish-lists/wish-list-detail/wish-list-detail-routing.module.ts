import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { WishListDetailPage } from './wish-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WishListDetailPage
  },
  {
    path: 'wish/:wishId',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-detail/wish-detail.module')
      .then(m => m.WishDetailPageModule)
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-list-update/wish-list-update.module')
      .then(m => m.WishListUpdatePageModule)
  },
  {
    path: 'wish-search',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishSearch/wish-search-overview/wish-search-overview.module')
      .then(m => m.WishSearchSelectionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListDetailPageRoutingModule { }
