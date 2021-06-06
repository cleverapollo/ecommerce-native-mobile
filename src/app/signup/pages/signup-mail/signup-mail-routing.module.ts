import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupMailPage } from './signup-mail.page';

const routes: Routes = [
  {
    path: '',
    component: SignupMailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupMailPageRoutingModule {}
