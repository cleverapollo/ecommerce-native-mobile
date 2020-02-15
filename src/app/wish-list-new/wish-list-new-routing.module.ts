import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListNewPage } from './wish-list-new.page';

const routes: Routes = [
  {
    path: '',
    component: WishListNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListNewPageRoutingModule {}
