import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductSearchOverviewPage } from './product-search-overview.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSearchOverviewPage
  },
  {
    path: 'amazon',
    loadChildren: () => import('../product-search-amazon/product-search-amazon.module')
      .then(m => m.ProductSearchAmazonPageModule)
  },
  {
    path: 'url',
    loadChildren: () => import('../product-search-url/product-search-url.module')
      .then(m => m.ProductSearchUrlPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSearchOverviewPageRoutingModule { }
