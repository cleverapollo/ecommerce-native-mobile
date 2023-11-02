import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorDetailPublicPage } from './creator-detail-public.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorDetailPublicPage
  },
  {
    path: ':listName',
    loadChildren: () => import('./../../product-lists/product-list-shared/product-list-shared.module').then(m => m.ProductListSharedPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorDetailPublicPageRoutingModule { }
