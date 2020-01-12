import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';
import { IntroductionComponent } from './introduction/introduction.component';
import { WishListNameComponent } from './wish-list-name/wish-list-name.component';
import { WishListDateComponent } from './wish-list-date/wish-list-date.component';
import { WishListPartnerComponent } from './wish-list-partner/wish-list-partner.component';
import { WishListWishComponent } from './wish-list-wish/wish-list-wish.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { AccountFirstNameComponent } from './account-first-name/account-first-name.component';
import { AccountEmailPasswordComponent } from './account-email-password/account-email-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegistrationPageRoutingModule
  ],
  declarations: [
    AccountFirstNameComponent,
    AccountEmailPasswordComponent,
    RegistrationPage, 
    IntroductionComponent, 
    WishListNameComponent, 
    WishListDateComponent,
    WishListPartnerComponent,
    WishListWishComponent,
    SearchResultsComponent,
    SearchResultComponent
  ]
})
export class RegistrationPageModule {}
