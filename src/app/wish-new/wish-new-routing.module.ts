import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishNewPage } from './wish-new.page';

const routes: Routes = [
  {
    path: '',
    component: WishNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishNewPageRoutingModule {}
