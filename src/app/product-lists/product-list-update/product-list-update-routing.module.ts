import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListUpdatePage } from './product-list-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProductListUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListUpdatePageRoutingModule {}
