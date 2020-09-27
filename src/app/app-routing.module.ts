import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EmailVerificationResolver } from '@registration/email-confirmation/email-verification.resolver';
import { EmailVerificationTokenGuard } from '@registration/email-confirmation/email-verification-token.guard';
import { SharedWishListResolver } from '@wishLists/shared-wish-list/shared-wish-list.resolver';
import { SharedWishListPageGuard } from '@wishLists/shared-wish-list/shared-wish-list-page.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'start', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'email-confirmation',
    canActivate: [EmailVerificationTokenGuard],
    resolve: { emailVerificationResponse: EmailVerificationResolver },
    loadChildren: () => import('@registration/email-confirmation/email-confirmation.module').then( m => m.EmailConfirmationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordModule)
  },
  {
    path: 'secure',
    loadChildren: () => import('./tab-bar/tab-bar.module').then( m => m.TabBarPageModule)
  },
  {
    path: 'shared-wish-list',
    canActivate: [SharedWishListPageGuard],
    resolve: { wishList: SharedWishListResolver },
    loadChildren: () => import('@wishLists/shared-wish-list/shared-wish-list.module').then( m => m.SharedWishListPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
