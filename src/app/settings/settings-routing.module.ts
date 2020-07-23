import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';
import { UserProfileResolver } from '../profile-edit/user-profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    resolve: { profile: UserProfileResolver },
  },
  {
    path: 'profile-settings-firstname',
    loadChildren: () => import('./pages/profile-settings-firstname/profile-settings-firstname.module').then( m => m.ProfileSettingsFirstnamePageModule)
  },
  {
    path: 'last-name-update',
    loadChildren: () => import('./pages/last-name-update/last-name-update.module').then( m => m.LastNameUpdatePageModule)
  },
  {
    path: 'birthday-update',
    loadChildren: () => import('./pages/birthday-update/birthday-update.module').then( m => m.BirthdayUpdatePageModule)
  },
  {
    path: 'email-update',
    loadChildren: () => import('./pages/email-update/email-update.module').then( m => m.EmailUpdatePageModule)
  },
  {
    path: 'password-update',
    loadChildren: () => import('./pages/password-update/password-update.module').then( m => m.PasswordUpdatePageModule)
  },
  {
    path: 'account-delete',
    loadChildren: () => import('./pages/account-delete/account-delete.module').then( m => m.AccountDeletePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
