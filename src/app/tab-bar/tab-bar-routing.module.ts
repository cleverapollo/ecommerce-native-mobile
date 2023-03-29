import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { getTaBarPath, TabBarRoute } from './tab-bar-routes';
import { TabBarPage } from './tab-bar.page';


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
        loadChildren: () => import('@wishLists/home/home.module')
          .then(m => m.HomePageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.PRODUCT_LIST_OVERVIEW, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('../product-lists/product-list-overview/product-list-overview.module')
          .then(m => m.ProductListOverviewPageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.FRIENDS_HOME, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('@friends/friends-home/friends-home.module')
          .then(m => m.FriendsHomePageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.WISH_SEARCH, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishSearch/wish-search-overview/wish-search-overview.module')
          .then(m => m.WishSearchSelectionPageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.MENU, false),
        loadChildren: () => import('../menu/menu.module')
          .then(m => m.MenuPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule { }
