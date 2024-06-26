import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordPage } from './forgot-password/forgot-password.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'reset-password',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'reset-password',
        loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule { }
