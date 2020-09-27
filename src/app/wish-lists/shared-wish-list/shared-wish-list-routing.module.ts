import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedWishListPage } from './shared-wish-list.page';

const routes: Routes = [
  {
    path: '',
    component: SharedWishListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedWishListPageRoutingModule {}
