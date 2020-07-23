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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
