import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

import { AmazonSearchResultsPage } from './amazon-search-results.page';

const routes: Routes = [
  {
    path: '',
    component: AmazonSearchResultsPage
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-create/wish-create.module').then( m => m.WishCreatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchResultsPageRoutingModule {}
