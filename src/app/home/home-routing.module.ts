import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AuthGuard } from '../shared/services/auth.guard';
import { FriendSelectOptionsResolver } from '../wish-list-create-update/friend-list-select-options.resolver';
import { WishListSelectOptionsResolver } from '../wish-new/wish-list-select-options.resolver';
import { UserRoleResolver } from '../shared/user-role.resolver';

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
    resolve: { userRole: UserRoleResolver },
    loadChildren: () => import('./../wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
