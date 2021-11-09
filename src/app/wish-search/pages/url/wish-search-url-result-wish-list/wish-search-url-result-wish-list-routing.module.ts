import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchUrlResultWishListPage } from './wish-search-url-result-wish-list.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchUrlResultWishListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchUrlResultWishListPageRoutingModule {}
