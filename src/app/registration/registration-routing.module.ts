import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroductionComponent } from './introduction/introduction.component';
import { WishListNameComponent } from './wish-list-name/wish-list-name.component';
import { WishListDateComponent } from './wish-list-date/wish-list-date.component';
import { WishListPartnerComponent } from './wish-list-partner/wish-list-partner.component';
import { WishListWishComponent } from './wish-list-wish/wish-list-wish.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchResultsResolver } from './search-results.resolver';
import { AccountFirstNameComponent } from './account-first-name/account-first-name.component';
import { AccountEmailPasswordComponent } from './account-email-password/account-email-password.component';
import { RegistrationCompletedComponent } from './registration-completed/registration-completed.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'introduction',
        component: IntroductionComponent
      },
      {
        path: 'wish-list-name',
        component: WishListNameComponent
      },
      {
        path: 'wish-list-date',
        component: WishListDateComponent
      },
      {
        path: 'wish-list-partner',
        component: WishListPartnerComponent
      },
      {
        path: 'wish-list-wish',
        component: WishListWishComponent
      },
      {
        path: 'search-results',
        component: SearchResultsComponent,
        resolve: { products: SearchResultsResolver }
      },
      {
        path: 'first-name',
        component: AccountFirstNameComponent
      },
      {
        path: 'credentials',
        component: AccountEmailPasswordComponent
      },
      {
        path: 'registration-complete',
        component: RegistrationCompletedComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    SearchResultsResolver
  ]
})
export class RegistrationPageRoutingModule {}
