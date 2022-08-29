import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishCreatePage } from './wish-create.page';

const routes: Routes = [
  {
    path: '',
    component: WishCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishCreatePageRoutingModule {}
