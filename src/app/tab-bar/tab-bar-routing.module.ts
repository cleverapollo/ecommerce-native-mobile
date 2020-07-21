import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';
import { AuthGuard } from '../shared/services/auth.guard';
import { WishListResolver } from '../home/wish-list.resolver';
import { UserRoleResolver } from '../shared/user-role.resolver';
import { FriendsWishListResolver } from '../friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from '../profile-edit/user-profile.resolver';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabBarPage, 
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            resolve: { wishLists: WishListResolver, userRole: UserRoleResolver },
            loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'friends-wish-list-overview',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            resolve: { wishLists: FriendsWishListResolver },
            loadChildren: () => import('./../friends-wish-list-overview/friends-wish-list-overview.module').then( m => m.FriendsWishListOverviewPageModule)
          }
        ]
      },
      {
        path: 'wish-search',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            loadChildren: () => import('./../wish-search/wish-search.module').then( m => m.WishSearchPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('./../settings/settings.module').then( m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}
