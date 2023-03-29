import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfileResolver } from '@shared/user-profile.resolver';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage
  },
  {
    path: 'settings',
    children: [
      {
        path: '',
        resolve: { profile: UserProfileResolver },
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
      }
    ]
  },
  {
    path: 'create-creator-account',
    loadChildren: () => import('./creator-account-create/creator-account-create.module').then(m => m.CreateCreatorAccountPageModule)
  },
  {
    path: 'creator-account-info',
    loadChildren: () => import('./creator-account-info/creator-account-info.module').then(m => m.CreatorAccountInfoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule { }
