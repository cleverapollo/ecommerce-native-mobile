import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountEnabledGuard } from '@guards/account-enabled.guard';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
  {
    path: 'profile-settings-firstname',
    canActivate: [AccountEnabledGuard],
    loadChildren: () => import('./pages/profile-settings-firstname/profile-settings-firstname.module').then( m => m.ProfileSettingsFirstnamePageModule)
  },
  {
    path: 'last-name-update',
    canActivate: [AccountEnabledGuard],
    loadChildren: () => import('./pages/last-name-update/last-name-update.module').then( m => m.LastNameUpdatePageModule)
  },
  {
    path: 'birthday-update',
    canActivate: [AccountEnabledGuard],
    loadChildren: () => import('./pages/birthday-update/birthday-update.module').then( m => m.BirthdayUpdatePageModule)
  },
  {
    path: 'email-update',
    canActivate: [AccountEnabledGuard],
    loadChildren: () => import('./pages/email-update/email-update.module').then( m => m.EmailUpdatePageModule)
  },
  {
    path: 'password-update',
    canActivate: [AccountEnabledGuard],
    loadChildren: () => import('./pages/password-update/password-update.module').then( m => m.PasswordUpdatePageModule)
  },
  {
    path: 'account-delete',
    loadChildren: () => import('./pages/account-delete/account-delete.module').then( m => m.AccountDeletePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
