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
    path: 'edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-update/wish-update.module').then( m => m.WishUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishDetailPageRoutingModule {}
