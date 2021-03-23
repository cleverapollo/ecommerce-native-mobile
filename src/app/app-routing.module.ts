import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SharedWishListResolver } from '@wishLists/shared-wish-list/shared-wish-list.resolver';
import { AutoLoginGuard } from '@guards/auto-login.guard';
import { AccessGuard } from '@guards/access.guard';
import { EmailVerificationStatusResolver } from './email-verification/email-verification-status.resolver';
import { SharedWishListAccessGuard } from '@guards/shared-wish-list-access.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'start', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    canActivate: [AccessGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    canActivate: [AccessGuard],
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'start',
    canActivate: [AccessGuard],
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordModule)
  },
  {
    path: 'secure',
    canActivate: [AccessGuard],
    loadChildren: () => import('./tab-bar/tab-bar.module').then( m => m.TabBarPageModule)
  },
  {
    path: 'meine-wunschliste/:wishListId',
    canActivate: [SharedWishListAccessGuard],
    resolve: { data: SharedWishListResolver },
    loadChildren: () => import('@wishLists/shared-wish-list/shared-wish-list.module').then( m => m.SharedWishListPageModule)
  },
  {
    path: 'email-verification',
    resolve: { emailVerificationStatus: EmailVerificationStatusResolver },
    loadChildren: () => import('./email-verification/email-verification.module').then( m => m.EmailVerificationPageModule)
  }
  // test
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
