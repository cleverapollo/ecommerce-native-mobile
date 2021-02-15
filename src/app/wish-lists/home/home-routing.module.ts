import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountEnabledGuard } from '@guards/account-enabled.guard';
import { AuthGuard } from '@guards/auth.guard';
import { ShowOnboardingSlidesResolver } from '@wishLists/home/show-onboarding-slides.resolver';
import { EmailVerificationTokenResolver } from './email-verification-token.resolver';
import { HomePage } from './home.page';
import { WishListResolver } from './wish-list.resolver';
import { WishListsResolver } from './wish-lists.resolver';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'wish-list-overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomePage,
    resolve: { showOnboardingSlides: ShowOnboardingSlidesResolver },
    children: [
      {
        path: 'wish-list-overview',
        canActivate: [AuthGuard],
        resolve: { wishLists: WishListsResolver, emailVerificationResponse: EmailVerificationTokenResolver },
        loadChildren: () => import('@wishLists/wish-list-overview/wish-list-overview.module').then( m => m.WishListOverviewPageModule)
      },
      {
        path: 'wish-list-new',
        canActivate: [AuthGuard, AccountEnabledGuard], 
        loadChildren: () => import('@wishLists/wish-list-create-update/wish-list-create-update.module').then( m => m.WishListCreateUpdatePageModule)
      },
      {
        path: 'wish-list/:wishListId',
        canActivate: [AuthGuard],
        resolve: { wishList: WishListResolver },
        loadChildren: () => import('@wishLists/wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
      },
      {
        path: 'wish-search-selection',
        canActivate: [AuthGuard, AccountEnabledGuard],
        loadChildren: () => import('@wishLists/wish-search-selection/wish-search-selection.module').then( m => m.WishSearchSelectionPageModule)
      },
      {
        path: 'wish-new',
        canActivate: [AuthGuard, AccountEnabledGuard],
        loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
