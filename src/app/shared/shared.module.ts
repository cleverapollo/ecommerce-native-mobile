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
import { ImageComponent } from './components/image/image.component';

@NgModule({
  declarations: [
    SecurePipe, 
    AffiliateLinkDebugInfoComponent,
    ImageComponent,
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
    AffiliateLinkDebugInfoComponent,
    ImageComponent,
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
    TruncateNamePipe,
    UserInitialsComponent,
    WishListRadioComponent
  ]
})
export class SharedModule { }
