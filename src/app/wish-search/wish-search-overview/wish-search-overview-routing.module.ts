import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchOverviewPage } from './wish-search-overview.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchOverviewPage
  },
  {
    path: 'search-by-amazon',
    loadChildren: () => import('@wishSearch/amazon-search-results/amazon-search-results.module')
      .then( m => m.WishSearchResultsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchSelectionPageRoutingModule {}
