import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordUpdatePage } from './password-update.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordUpdatePageRoutingModule {}
