import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchPage } from './wish-search.page';
import { AuthGuard } from '../shared/guards/auth.guard';
import { WishListSelectOptionsResolver } from '../wish-new/wish-list-select-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: WishSearchPage
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],  // RoleGuard
    resolve: { wishListSelectOptions: WishListSelectOptionsResolver },
    loadChildren: () => import('./../wish-new/wish-new.module').then( m => m.WishNewPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchPageRoutingModule {}
