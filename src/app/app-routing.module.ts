import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { WishListResolver } from './home/wish-list.resolver';
import { WishListSelectOptionsResolver } from './wish-new/wish-list-select-options.resolver';
import { FriendsWishListResolver } from './friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from './shared/user-profile.resolver';
import { FriendSelectOptionsResolver } from './wish-list-create-update/friend-list-select-options.resolver';
import { UserRoleResolver } from './shared/user-role.resolver';
import { RoleGuard } from './shared/services/role.guard';
import { EmailVerificationResolver } from './email-confirmation/email-verification.resolver';
import { EmailVerificationTokenGuard } from './email-confirmation/email-verification-token.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tab-bar/tab-bar.module').then( m => m.TabBarPageModule)
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
    loadChildren: () => import('./email-confirmation/email-confirmation.module').then( m => m.EmailConfirmationPageModule)
  },  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
