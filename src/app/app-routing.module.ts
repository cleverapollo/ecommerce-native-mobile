import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { WishListResolver } from './home/wish-list.resolver';
import { WishListSelectOptionsResolver } from './wish-new/wish-list-select-options.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    resolve: { wishLists: WishListResolver },
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
    loadChildren: () => import('./wish-list-detail/wish-list-detail.module').then( m => m.WishListDetailPageModule)
  },
  {
    path: 'wish-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-detail/wish-detail.module').then( m => m.WishDetailPageModule)
  },
  {
    path: 'wish-list-new',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-list-new/wish-list-new.module').then( m => m.WishListNewPageModule)
  },
  {
    path: 'wish-search',
    canActivate: [AuthGuard],
    loadChildren: () => import('./wish-search/wish-search.module').then( m => m.WishSearchPageModule)
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],
    resolve: { wishListSelectOptions: WishListSelectOptionsResolver },
    loadChildren: () => import('./wish-new/wish-new.module').then( m => m.WishNewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
