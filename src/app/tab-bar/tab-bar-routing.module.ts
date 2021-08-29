import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';
import { AuthGuard } from '@guards/auth.guard';
import { getTaBarPath, TabBarRoute } from './tab-bar-routes';


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
        path: getTaBarPath(TabBarRoute.HOME, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.FRIENDS_HOME, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('@friends/friends-home/friends-home.module').then( m => m.FriendsHomePageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.WISH_SEARCH, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-search-results/wish-search-results.module').then( m => m.WishSearchResultsPageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.MENU, false),
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
