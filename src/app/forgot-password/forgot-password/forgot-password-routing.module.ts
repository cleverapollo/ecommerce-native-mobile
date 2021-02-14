import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordPage } from './forgot-password.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./../reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./../change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordPageRoutingModule {}
