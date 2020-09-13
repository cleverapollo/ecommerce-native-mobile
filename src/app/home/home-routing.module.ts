import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthGuard } from '../shared/guards/auth.guard';
import { FriendSelectOptionsResolver } from '../wish-list-create-update/friend-list-select-options.resolver';
import { WishListSelectOptionsResolver } from '../wish-create-update/wish-list-select-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'wish-list-new',
    canActivate: [AuthGuard], // RoleGuard
    resolve: { friends: FriendSelectOptionsResolver },
    loadChildren: () => import('./../wish-list-create-update/wish-list-create-update.module').then( m => m.WishListCreateUpdatePageModule)
  },
  {
    path: 'wish-list-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./../wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
  },
  {
    path: 'wish-search-selection',
    canActivate: [AuthGuard],
    loadChildren: () => import('./../wish-search-selection/wish-search-selection.module').then( m => m.WishSearchSelectionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
