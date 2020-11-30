import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SharedWishListResolver } from '@wishLists/shared-wish-list/shared-wish-list.resolver';
import { SharedWishListPageGuard } from '@wishLists/shared-wish-list/shared-wish-list-page.guard';
import { AutoLoginGuard } from '@guards/auto-login.guard';
import { AccessGuard } from '@guards/access.guard';

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
    canActivate: [AccessGuard],
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordModule)
  },
  {
    path: 'secure',
    canActivate: [AccessGuard],
    loadChildren: () => import('./tab-bar/tab-bar.module').then( m => m.TabBarPageModule)
  },
  {
    path: 'shared-wish-list',
    canActivate: [SharedWishListPageGuard],
    resolve: { data: SharedWishListResolver },
    loadChildren: () => import('@wishLists/shared-wish-list/shared-wish-list.module').then( m => m.SharedWishListPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
