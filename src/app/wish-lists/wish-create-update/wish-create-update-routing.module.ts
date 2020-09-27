import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishCreateUpdatePage } from './wish-create-update.page';

const routes: Routes = [
  {
    path: '',
    component: WishCreateUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishNewPageRoutingModule {}
