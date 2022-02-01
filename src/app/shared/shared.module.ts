import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './pipes/secure.pipe';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { IonicModule } from '@ionic/angular';
import { HintComponent } from './components/hint/hint.component';
import { EmailUnverifiedHintComponent } from './components/email-unverified-hint/email-unverified-hint.component';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { NavToolbarComponent } from './components/nav-toolbar/nav-toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { WishListRadioComponent } from './components/wish-list-radio/wish-list-radio.component';
import { UserInitialsComponent } from './components/user-initials/user-initials.component';
import { OwnersInfoComponent } from './components/owners-info/owners-info.component';
import { TruncateNamePipe } from './pipes/truncate-name.pipe';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { AffiliateLinkDebugInfoComponent } from './components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { WishImageComponent } from './components/wish-image/wish-image.component';
import { WishShopInfoComponent } from './components/wish-shop-info/wish-shop-info.component';
import { SortByIsFavoritePipe } from './pipes/sort-by-is-favorite.pipe';

@NgModule({
  declarations: [
    SecurePipe, 
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    HintComponent,
    NavToolbarComponent,
    SearchResultComponent,
    ShowHidePasswordComponent,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent,
    TruncateNamePipe,
    SortByIsFavoritePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    SecurePipe, 
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    HintComponent,
    NavToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    SearchResultComponent,
    ShowHidePasswordComponent,
    SortByIsFavoritePipe,
    TruncateNamePipe,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent
  ]
})
export class SharedModule { }
