import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorProductListDetailPage } from './creator-product-list-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorProductListDetailPage
  },
  {
    path: 'wish-create',
    loadChildren: () => import('@wishLists/wish-create/wish-create.module').then(m => m.WishCreatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorProductListDetailPageRoutingModule { }
