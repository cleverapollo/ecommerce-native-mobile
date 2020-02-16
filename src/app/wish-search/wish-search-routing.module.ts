import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchPage } from './wish-search.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchPageRoutingModule {}
