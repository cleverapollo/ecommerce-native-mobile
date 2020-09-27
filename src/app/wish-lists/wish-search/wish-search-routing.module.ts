import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishSearchPage } from './wish-search.page';
import { AuthGuard } from '@guards/auth.guard';
import { WishListSelectOptionsResolver } from '@wishLists/wish-create-update/wish-list-select-options.resolver';

const routes: Routes = [
  {
    path: '',
    component: WishSearchPage
  },
  {
    path: 'wish-new',
    canActivate: [AuthGuard],  // RoleGuard
    resolve: { wishListSelectOptions: WishListSelectOptionsResolver },
    loadChildren: () => import('@wishLists/wish-create-update/wish-create-update.module').then( m => m.WishCreateUpdatePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WishSearchPageRoutingModule {}