import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatorAccountInfoPage } from './creator-account-info.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorAccountInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorAccountInfoPageRoutingModule {}
