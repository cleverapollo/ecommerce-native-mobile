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
    component: ForgotPasswordPage,
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
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule { }
