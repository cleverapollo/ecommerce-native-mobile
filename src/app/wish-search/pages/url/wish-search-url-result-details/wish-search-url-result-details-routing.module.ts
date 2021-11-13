import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchUrlResultDetailsPage } from './wish-search-url-result-details.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchUrlResultDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchUrlResultDetailsPageRoutingModule {}
