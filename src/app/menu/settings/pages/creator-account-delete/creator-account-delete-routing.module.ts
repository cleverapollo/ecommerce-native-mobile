import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorAccountDeletePage } from './creator-account-delete.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorAccountDeletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorAccountDeletePageRoutingModule {}
