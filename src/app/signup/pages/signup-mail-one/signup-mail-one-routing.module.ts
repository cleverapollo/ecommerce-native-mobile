import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupMailOnePage } from './signup-mail-one.page';

const routes: Routes = [
  {
    path: '',
    component: SignupMailOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupMailOnePageRoutingModule {}
