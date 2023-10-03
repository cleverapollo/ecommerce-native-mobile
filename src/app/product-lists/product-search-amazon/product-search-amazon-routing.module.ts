import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductSearchAmazonPage } from './product-search-amazon.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSearchAmazonPage
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
export class ProductSearchAmazonPageRoutingModule { }
