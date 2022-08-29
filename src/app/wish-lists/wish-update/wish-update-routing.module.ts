import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishUpdatePage } from './wish-update.page';

const routes: Routes = [
  {
    path: '',
    component: WishUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishUpdatePageRoutingModule {}
