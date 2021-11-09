import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchUrlResultImagesPage } from './wish-search-url-result-images.page';

const routes: Routes = [
  {
    path: '',
    component: WishSearchUrlResultImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchUrlResultImagesPageRoutingModule {}
