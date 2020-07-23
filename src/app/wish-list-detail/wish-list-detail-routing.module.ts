import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListDetailPage } from './wish-list-detail.page';
import { AuthGuard } from '../shared/services/auth.guard';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListDetailPageRoutingModule {}
