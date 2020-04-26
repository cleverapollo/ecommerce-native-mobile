import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishEditPage } from './wish-edit.page';

const routes: Routes = [
  {
    path: '',
    component: WishEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishEditPageRoutingModule {}
