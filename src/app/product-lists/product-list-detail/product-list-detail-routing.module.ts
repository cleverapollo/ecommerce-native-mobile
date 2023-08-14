import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListDetailPage } from './product-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductListDetailPage
  },
  {
    path: 'edit',
    loadChildren: () => import('../product-list-update/product-list-update.module')
      .then(m => m.ProductListUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListDetailPageRoutingModule { }
