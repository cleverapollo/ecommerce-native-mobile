import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductSearchUrlPage } from './product-search-url.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSearchUrlPage
  },
  {
    path: 'product-new',
    loadChildren: () => import('../product-create/product-create.module').then(m => m.ProductCreatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSearchUrlPageRoutingModule { }
