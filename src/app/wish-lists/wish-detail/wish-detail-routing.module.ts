import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishDetailPage } from './wish-detail.page';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WishDetailPage
  },
  {
    path: 'wish-edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishDetailPageRoutingModule {}
