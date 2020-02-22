import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListEditPage } from './wish-list-edit.page';

const routes: Routes = [
  {
    path: '',
    component: WishListEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishListEditPageRoutingModule {}
