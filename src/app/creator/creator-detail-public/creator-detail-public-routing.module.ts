import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorDetailPublicPage } from './creator-detail-public.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorDetailPublicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorDetailPublicPageRoutingModule {}
