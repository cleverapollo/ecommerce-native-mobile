import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';
import { UserProfileResolver } from '@shared/user-profile.resolver';

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
        loadChildren: () => import('./../settings/settings.module').then( m => m.SettingsPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
