import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WishListNamePage } from './wish-list-name/wish-list-name.page';
import { WishListDatePage } from './wish-list-date/wish-list-date.page';
import { WishListPartnerPage } from './wish-list-partner/wish-list-partner.page';
import { WishListWishPage } from './wish-list-wish/wish-list-wish.page';
import { SearchResultsPage } from './search-results/search-results.page';
import { SearchResultsResolver } from './search-results.resolver';
import { AccountFirstNamePage } from './account-first-name/account-first-name.page';
import { AccountEmailPasswordPage } from './account-email-password/account-email-password.page';
import { RegistrationCompletedPage } from './registration-completed/registration-completed.page';
import { BirthdayPage } from './birthday/birthday.page';
import { GenderPage } from './gender/gender.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'wish-list-name',
        component: WishListNamePage
      },
      {
        path: 'wish-list-date',
        component: WishListDatePage
      },
      {
        path: 'wish-list-partner',
        component: WishListPartnerPage
      },
      {
        path: 'wish-list-wish',
        component: WishListWishPage
      },
      {
        path: 'search-results',
        component: SearchResultsPage,
        resolve: { searchResult: SearchResultsResolver }
      },
      {
        path: 'first-name',
        component: AccountFirstNamePage
      },
      {
        path: 'birthday',
        component: BirthdayPage
      },
      {
        path: 'gender',
        component: GenderPage
      },
      {
        path: 'credentials',
        component: AccountEmailPasswordPage
      },
      {
        path: 'registration-complete',
        component: RegistrationCompletedPage
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
