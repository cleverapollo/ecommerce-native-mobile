import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListsPage } from './product-lists.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'product-list-overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ProductListsPage,
    children: [
      {
        path: 'product-list-overview',
        loadChildren: () => import('../product-list-overview/product-list-overview.module')
          .then(m => m.ProductListOverviewPageModule)
      },
      {
        path: 'product-list-new',
        loadChildren: () => import('../product-list-create/product-list-create.module')
          .then(m => m.ProductListCreatePageModule)
      },
      {
        path: 'product-list/:productListId',
        loadChildren: () => import('../product-list-detail/product-list-detail.module')
          .then(m => m.ProductListDetailPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListsPageRoutingModule { }
