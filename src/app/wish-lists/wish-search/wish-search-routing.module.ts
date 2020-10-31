import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchPage } from './wish-search.page';
import { AuthGuard } from '@guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'wish-search-results',
    pathMatch: 'full'
  },
  {
    path: '',
    component: WishSearchPage,
    children: [
      {
        path: 'wish-search-results',
        loadChildren: () => import('./../wish-search-results/wish-search-results.module').then( m => m.WishSearchResultsPageModule)
      },
      {
        path: 'wish-new',
        canActivate: [AuthGuard],  // RoleGuard
        loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchPageRoutingModule {}
