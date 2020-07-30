import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListGuestsPage } from './wish-list-guests.page';

const routes: Routes = [
  {
    path: '',
    component: WishListGuestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListGuestsPageRoutingModule {}
