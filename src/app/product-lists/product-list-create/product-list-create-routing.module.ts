import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListCreatePage } from './product-list-create.page';

const routes: Routes = [
  {
    path: '',
    component: ProductListCreatePage,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListCreatePageRoutingModule { }
