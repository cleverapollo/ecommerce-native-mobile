import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';
import { AuthGuard } from '@guards/auth.guard';

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
        loadChildren: () => import('@wishLists/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'friends-home',
        canActivate: [AuthGuard],
        loadChildren: () => import('@friends/friends-home//friends-home.module').then( m => m.FriendsHomePageModule)
      },
      {
        path: 'wish-search',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-search/wish-search.module').then( m => m.WishSearchPageModule)
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
