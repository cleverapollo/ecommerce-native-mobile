import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchSelectionPage } from './wish-search-selection.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchSelectionPage
  },
  {
    path: 'wish-search-results',
    loadChildren: () => import('./../wish-search-results/wish-search-results.module').then( m => m.WishSearchResultsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchSelectionPageRoutingModule {}
