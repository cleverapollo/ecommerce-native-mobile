import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { WishListResolver } from './home/wish-list.resolver';
import { WishListSelectOptionsResolver } from './wish-new/wish-list-select-options.resolver';
import { FriendsWishListResolver } from './friends-wish-list-overview/friends-wish-list.resolver';
import { UserProfileResolver } from './profile-edit/user-profile.resolver';
import { FriendSelectOptionsResolver } from './wish-list-new/friend-list-select-options.resolver';
import { UserRoleResolver } from './shared/user-role.resolver';
import { RoleGuard } from './shared/services/role.guard';
import { EmailVerificationResolver } from './email-confirmation/email-verification.resolver';
import { EmailVerificationTokenGuard } from './email-confirmation/email-verification-token.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    resolve: { wishLists: WishListResolver, userRole: UserRoleResolver },
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
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
    path: 'wish-list-detail',
    canActivate: [AuthGuard],
    resolve: { userRole: UserRoleResolver },
    loadChildren: () => import('./wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
  },
  {
    path: 'wish-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-detail/wish-detail.module').then( m => m.WishDetailPageModule)
  },
  {
    path: 'wish-list-new',
    canActivate: [AuthGuard], // RoleGuard
    resolve: { friends: FriendSelectOptionsResolver },
    loadChildren: () => import('./wish-list-new/wish-list-new.module').then( m => m.WishListNewPageModule)
  },
  {
    path: 'wish-search',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-search/wish-search.module').then( m => m.WishSearchPageModule)
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],  // RoleGuard
    resolve: { wishListSelectOptions: WishListSelectOptionsResolver },
    loadChildren: () => import('./wish-new/wish-new.module').then( m => m.WishNewPageModule)
  },
  {
    path: 'wish-list-edit',
    canActivate: [AuthGuard],
    resolve: { friends: FriendSelectOptionsResolver },
    loadChildren: () => import('./wish-list-edit/wish-list-edit.module').then( m => m.WishListEditPageModule)
  },
  {
    path: 'friends-wish-list-overview',
    canActivate: [AuthGuard],
    resolve: { wishLists: FriendsWishListResolver },
    loadChildren: () => import('./friends-wish-list-overview/friends-wish-list-overview.module').then( m => m.FriendsWishListOverviewPageModule)
  },
  {
    path: 'friends-wish-list-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./friends-wish-list-detail/friends-wish-list-detail.module').then( m => m.FriendsWishListDetailPageModule)
  },
  {
    path: 'profile-edit',
    canActivate: [AuthGuard],
    resolve: { profile: UserProfileResolver },
    loadChildren: () => import('./profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
  },
  {
    path: 'wish-edit',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-edit/wish-edit.module').then( m => m.WishEditPageModule)
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
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
