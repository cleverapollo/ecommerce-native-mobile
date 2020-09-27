import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListOverviewPage } from './wish-list-overview.page';

const routes: Routes = [
  {
    path: '',
    component: WishListOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListOverviewPageRoutingModule {}
