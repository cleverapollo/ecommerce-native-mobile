import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccessGuard } from '@guards/access.guard';
import { AuthGuard } from '@guards/auth.guard';
import { AutoLoginGuard } from '@guards/auto-login.guard';
import { FirebaseRouteGuard } from '@guards/firebase-route.guard';
import { SharedWishListAccessGuard } from '@guards/shared-wish-list-access.guard';
import { EmailVerificationStatusResolver } from './email-verification/email-verification-status.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [AccessGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'start',
    canLoad: [AutoLoginGuard],
    canActivate: [AccessGuard],
    loadChildren: () => import('./start/start.module').then(m => m.StartPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'secure',
    canActivate: [AccessGuard, AuthGuard],
    loadChildren: () => import('./tab-bar/tab-bar.module').then(m => m.TabBarPageModule)
  },
  {
    path: 'meine-wunschliste/:wishListId',
    canActivate: [SharedWishListAccessGuard],
    loadChildren: () => import('@wishLists/shared-wish-list/shared-wish-list.module').then(m => m.SharedWishListPageModule)
  },
  {
    path: 'email-verification',
    resolve: { emailVerificationStatus: EmailVerificationStatusResolver },
    loadChildren: () => import('./email-verification/email-verification.module').then(m => m.EmailVerificationPageModule)
  },
  {
    path: 'firebase',
    canActivate: [FirebaseRouteGuard],
    loadChildren: () => import('./firebase-route/firebase-route.module').then(m => m.FirebaseRouteModule)
  },
  {
    path: 'signup',
    canActivate: [AccessGuard],
    children: [
      {
        path: 'signup-mail',
        loadChildren: () => import('./signup/pages/signup-mail/signup-mail.module').then(m => m.SignupMailPageModule)
      },
      {
        path: 'signup-mail-two',
        loadChildren: () => import('./signup/pages/signup-mail-two/signup-mail-two.module').then(m => m.SignupMailTwoPageModule)
      },
      {
        path: 'signup-completed',
        loadChildren: () => import('./signup/pages/signup-completed/signup-completed.module').then(m => m.SignupCompletedPageModule)
      }
    ]
  },
  {
    path: 'creator/:userName',
    loadChildren: () => import('./creator/creator-detail-public/creator-detail-public.module').then(m => m.CreatorDetailPublicPageModule),
    children: [
      {
        path: ':listName',
        loadChildren: () => import('./product-lists/product-list-shared/product-list-shared.module').then(m => m.ProductListSharedPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
