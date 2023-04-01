import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorNameUpdatePage } from './creator-name-update.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorNameUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorNameUpdatePageRoutingModule {}
