import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorDetailPage } from './creator-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorDetailPageRoutingModule {}
