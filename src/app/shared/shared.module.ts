import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from './components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { CreatorComponent } from './components/creator/creator.component';
import { DatetimeComponent } from './components/datetime/datetime.component';
import { EmailUnverifiedHintComponent } from './components/email-unverified-hint/email-unverified-hint.component';
import { NavToolbarComponent } from './components/nav-toolbar/nav-toolbar.component';
import { OwnersInfoComponent } from './components/owners-info/owners-info.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { UserInitialsComponent } from './components/user-initials/user-initials.component';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { WishImageComponent } from './components/wish-image/wish-image.component';
import { WishListRadioComponent } from './components/wish-list-radio/wish-list-radio.component';
import { WishShopInfoComponent } from './components/wish-shop-info/wish-shop-info.component';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { SecurePipe } from './pipes/secure.pipe';
import { TruncateNamePipe } from './pipes/truncate-name.pipe';

@NgModule({
  declarations: [
    CreatorComponent,
    DatetimeComponent,
    SecurePipe,
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe,
    ValidationMessagesComponent,
    EmailUnverifiedHintComponent,
    NavToolbarComponent,
    SearchResultComponent,
    ShowHidePasswordComponent,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent,
    TruncateNamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    CreatorComponent,
    DatetimeComponent,
    SecurePipe,
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe,
    ValidationMessagesComponent,
    EmailUnverifiedHintComponent,
    NavToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    SearchResultComponent,
    ShowHidePasswordComponent,
    TruncateNamePipe,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent
  ]
})
export class SharedModule { }
