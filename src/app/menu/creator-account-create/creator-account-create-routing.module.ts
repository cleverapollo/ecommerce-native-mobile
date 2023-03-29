import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreatorAccountCreatePage } from './creator-account-create.page';

const routes: Routes = [
  {
    path: '',
    component: CreatorAccountCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCreatorAccountPageRoutingModule { }
