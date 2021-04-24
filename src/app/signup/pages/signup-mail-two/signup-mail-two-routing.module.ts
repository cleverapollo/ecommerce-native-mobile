import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupMailTwoPage } from './signup-mail-two.page';

const routes: Routes = [
  {
    path: '',
    component: SignupMailTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupMailTwoPageRoutingModule {}
