import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishDetailPage } from './wish-detail.page';
import { AuthGuard } from '../shared/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WishDetailPage
  },
  {
    path: 'wish-edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('./../wish-edit/wish-edit.module').then( m => m.WishEditPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishDetailPageRoutingModule {}
