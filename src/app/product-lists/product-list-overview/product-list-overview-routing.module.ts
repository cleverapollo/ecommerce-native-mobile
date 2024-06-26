import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListOverviewPage } from './product-list-overview.page';

const routes: Routes = [
  {
    path: '',
    component: ProductListOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListOverviewPageRoutingModule { }
