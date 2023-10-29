import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorDetailPage } from './creator-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorDetailPage
  },
  {
    path: 'product-list/:listId',
    loadChildren: () => import('../creator-product-list-detail/creator-product-list-detail.module').then(m => m.CreatorProductListDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorDetailPageRoutingModule { }
