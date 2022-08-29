import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListUpdatePage } from './wish-list-update.page';

const routes: Routes = [
  {
    path: '',
    component: WishListUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListNewPageRoutingModule {}
