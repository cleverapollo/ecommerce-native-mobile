import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { HomePage } from './home.page';
import { WishListResolver } from './wish-list.resolver';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'wish-list-overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'wish-list-overview',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-list-overview/wish-list-overview.module')
          .then( m => m.WishListOverviewPageModule)
      },
      {
        path: 'wish-list-new',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-list-create/wish-list-create.module')
          .then( m => m.WishListCreatePageModule)
      },
      {
        path: 'wish-list/:wishListId',
        canActivate: [AuthGuard],
        resolve: { wishList: WishListResolver },
        loadChildren: () => import('@wishLists/wish-list-detail/wish-list-detail.module')
          .then( m => m.WishListDetailPageModule)
      },
      {
        path: 'wish-new',
        canActivate: [AuthGuard],
        loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module')
          .then( m => m.WishCreateUpdatePageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
