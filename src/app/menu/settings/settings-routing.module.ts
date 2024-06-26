import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
  {
    path: 'profile-image-update',
    loadChildren: () => import('./pages/profile-image-update/profile-image-update.module')
      .then(m => m.ProfileImageUpdatePageModule)
  },
  {
    path: 'profile-settings-firstname',
    loadChildren: () => import('./pages/profile-settings-firstname/profile-settings-firstname.module')
      .then(m => m.ProfileSettingsFirstnamePageModule)
  },
  {
    path: 'last-name-update',
    loadChildren: () => import('./pages/last-name-update/last-name-update.module')
      .then(m => m.LastNameUpdatePageModule)
  },
  {
    path: 'birthday-update',
    loadChildren: () => import('./pages/birthday-update/birthday-update.module')
      .then(m => m.BirthdayUpdatePageModule)
  },
  {
    path: 'email-update',
    loadChildren: () => import('./pages/email-update/email-update.module')
      .then(m => m.EmailUpdatePageModule)
  },
  {
    path: 'password-update',
    loadChildren: () => import('./pages/password-update/password-update.module')
      .then(m => m.PasswordUpdatePageModule)
  },
  {
    path: 'account-delete',
    loadChildren: () => import('./pages/account-delete/account-delete.module')
      .then(m => m.AccountDeletePageModule)
  },
  {
    path: 'creator-name-update',
    loadChildren: () => import('./pages/creator-name-update/creator-name-update.module').then(m => m.CreatorNameUpdatePageModule)
  },
  {
    path: 'creator-user-name-update',
    loadChildren: () => import('./pages/creator-user-name-update/creator-user-name-update.module').then(m => m.CreatorUserNameUpdatePageModule)
  },
  {
    path: 'creator-intro-text-update',
    loadChildren: () => import('./pages/creator-intro-text-update/creator-intro-text-update.module').then(m => m.CreatorIntroTextUpdatePageModule)
  },
  {
    path: 'creator-social-media-links-update',
    loadChildren: () => import('./pages/creator-social-media-links-update/creator-social-media-links-update.module').then(m => m.CreatorSocialMediaLinksUpdatePageModule)
  },  {
    path: 'creator-account-delete',
    loadChildren: () => import('./pages/creator-account-delete/creator-account-delete.module').then( m => m.CreatorAccountDeletePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule { }
