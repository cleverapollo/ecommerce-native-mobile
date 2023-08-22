import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListSharedPage } from './product-list-shared.page';

const routes: Routes = [
  {
    path: '',
    component: ProductListSharedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListSharedPageRoutingModule {}
