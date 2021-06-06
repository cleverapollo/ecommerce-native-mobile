import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupCompletedPage } from './signup-completed.page';

const routes: Routes = [
  {
    path: '',
    component: SignupCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupCompletedPageRoutingModule {}
