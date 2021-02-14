import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './pipes/secure.pipe';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { IonicModule } from '@ionic/angular';
import { CacheImagePipe } from './pipes/cache-image.pipe';
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

@NgModule({
  declarations: [
    SecurePipe, 
    OwnersInfoComponent,
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    CacheImagePipe, 
    HintComponent,
    NavToolbarComponent,
    SearchResultComponent,
    ShowHidePasswordComponent,
    UserInitialsComponent,
    WishListRadioComponent,
    TruncateNamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    SecurePipe, 
    OwnersInfoComponent,
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    CacheImagePipe, 
    HintComponent,
    NavToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    SearchResultComponent,
    ShowHidePasswordComponent,
    TruncateNamePipe,
    UserInitialsComponent,
    WishListRadioComponent
  ]
})
export class SharedModule { }
