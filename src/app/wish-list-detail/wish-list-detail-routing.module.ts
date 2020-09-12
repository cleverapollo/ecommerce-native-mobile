import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListDetailPage } from './wish-list-detail.page';
import { AuthGuard } from '../shared/guards/auth.guard';
import { FriendSelectOptionsResolver } from '../wish-list-create-update/friend-list-select-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: WishListDetailPage
  },
  {
    path: 'wish-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./../wish-detail/wish-detail.module').then( m => m.WishDetailPageModule)
  },
  {
    path: 'wish-list-edit',
    canActivate: [AuthGuard],
    resolve: { friends: FriendSelectOptionsResolver },
    loadChildren: () => import('./../wish-list-create-update/wish-list-create-update.module').then( m => m.WishListCreateUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListDetailPageRoutingModule {}
