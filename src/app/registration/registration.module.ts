import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { WishListNamePage } from './wish-list-name/wish-list-name.page';
import { WishListDatePage } from './wish-list-date/wish-list-date.page';
import { WishListPartnerPage } from './wish-list-partner/wish-list-partner.page';
import { WishListWishPage } from './wish-list-wish/wish-list-wish.page';
import { SearchResultsPage } from './search-results/search-results.page';
import { AccountFirstNamePage } from './account-first-name/account-first-name.page';
import { AccountEmailPasswordPage } from './account-email-password/account-email-password.page';
import { RegistrationCompletedPage } from './registration-completed/registration-completed.page';
import { SharedModule } from '@shared/shared.module';
import { BirthdayPage } from './birthday/birthday.page';
import { Gender } from './registration-form';
import { GenderPage } from './gender/gender.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RegistrationPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AccountFirstNamePage,
    AccountEmailPasswordPage,
    BirthdayPage,
    GenderPage,
    WishListNamePage, 
    WishListDatePage,
    WishListPartnerPage,
    WishListWishPage,
    RegistrationCompletedPage,
    SearchResultsPage
  ]
})
export class RegistrationPageModule {}
