import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorUserNameUpdatePage } from './creator-user-name-update.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorUserNameUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorUserNameUpdatePageRoutingModule {}
