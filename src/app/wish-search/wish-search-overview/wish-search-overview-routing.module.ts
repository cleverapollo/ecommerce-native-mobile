import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WishSearchOverviewPage } from './wish-search-overview.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchOverviewPage
  },
  {
    path: 'search-by-amazon',
    loadChildren: () => import('@wishSearch/amazon-search-results/amazon-search-results.module')
      .then(m => m.WishSearchResultsPageModule)
  },
  {
    path: 'search-by-url',
    loadChildren: () => import('@wishSearch/url-search-results/url-search-results.module')
      .then(m => m.UrlSearchResultsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchSelectionPageRoutingModule { }
