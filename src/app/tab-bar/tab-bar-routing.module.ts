import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';
import { AuthGuard } from '../shared/services/auth.guard';
import { WishListResolver } from '../home/wish-list.resolver';
import { FriendsWishListResolver } from '../friends-wish-list-overview/friends-wish-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: TabBarPage, 
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
            resolve: { wishLists: WishListResolver },
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
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () => import('../menu/menu.module').then( m => m.MenuPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'secure/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'secure/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}
