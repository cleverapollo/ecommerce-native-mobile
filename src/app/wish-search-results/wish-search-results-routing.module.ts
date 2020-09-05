import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchResultsPage } from './wish-search-results.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchResultsPageRoutingModule {}
