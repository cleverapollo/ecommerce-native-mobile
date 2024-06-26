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
        path: getTaBarPath(TabBarRoute.PRODUCT_LISTS, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('../product-lists/product-lists/product-lists.module')
          .then(m => m.ProductListsPageModule)
      },
      {
        path: getTaBarPath(TabBarRoute.CREATOR_SEARCH, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('../creator/creator-search/creator-search.module').then(m => m.CreatorSearchPageModule)
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
        path: getTaBarPath(TabBarRoute.PRODUCT_SEARCH, false),
        canActivate: [AuthGuard],
        loadChildren: () => import('../product-lists/product-search-overview/product-search-overview.module')
          .then(m => m.ProductSearchOverviewPageModule)
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
