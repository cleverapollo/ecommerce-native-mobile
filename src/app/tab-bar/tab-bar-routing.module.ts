import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';
import { AuthGuard } from '../shared/guards/auth.guard';
import { WishListResolver } from '../home/wish-list.resolver';
import { FriendsWishListResolver } from '../friends-wish-list-overview/friends-wish-list.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabBarPage, 
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'friends-wish-list-overview',
        canActivate: [AuthGuard],
        resolve: { wishLists: FriendsWishListResolver },
        loadChildren: () => import('./../friends-wish-list-overview/friends-wish-list-overview.module').then( m => m.FriendsWishListOverviewPageModule)
      },
      {
        path: 'wish-search',
        canActivate: [AuthGuard],
        loadChildren: () => import('./../wish-search/wish-search.module').then( m => m.WishSearchPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('../menu/menu.module').then( m => m.MenuPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}
