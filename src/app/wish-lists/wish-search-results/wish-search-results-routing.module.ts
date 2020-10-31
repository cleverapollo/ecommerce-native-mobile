import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

import { WishSearchResultsPage } from './wish-search-results.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchResultsPage
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],  // RoleGuard
    loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchResultsPageRoutingModule {}
