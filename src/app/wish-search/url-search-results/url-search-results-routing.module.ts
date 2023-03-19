import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';

import { UrlSearchResultsPage } from './url-search-results.page';

const routes: Routes = [
  {
    path: '',
    component: UrlSearchResultsPage
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],
    loadChildren: () => import('@wishLists/wish-create/wish-create.module').then(m => m.WishCreatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrlSearchResultsPageRoutingModule { }
