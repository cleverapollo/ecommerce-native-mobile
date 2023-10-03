import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AffiliateLinkDebugInfoComponent } from './components/affiliate-link-debug-info/affiliate-link-debug-info.component';
import { CreatorComponent } from './components/creator/creator.component';
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component';
import { DatetimeComponent } from './components/datetime/datetime.component';
import { EmailUnverifiedHintComponent } from './components/email-unverified-hint/email-unverified-hint.component';
import { ListComponent } from './components/list/list.component';
import { NavToolbarComponent } from './components/nav-toolbar/nav-toolbar.component';
import { OwnersInfoComponent } from './components/owners-info/owners-info.component';
import { PhotoComponent } from './components/photo/photo.component';
import { ProductListRadioComponent } from './components/product-list-radio/product-list-radio.component';
import { ProductComponent } from './components/product/product.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { UserInitialsComponent } from './components/user-initials/user-initials.component';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { WishImageComponent } from './components/wish-image/wish-image.component';
import { WishListRadioComponent } from './components/wish-list-radio/wish-list-radio.component';
import { WishShopInfoComponent } from './components/wish-shop-info/wish-shop-info.component';
import { BackgroundImageDirective } from './directives/background-image.directive';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { SecurePipe } from './pipes/secure.pipe';
import { TruncateNamePipe } from './pipes/truncate-name.pipe';

@NgModule({
  declarations: [
    CreatorComponent,
    DashboardButtonComponent,
    DatetimeComponent,
    SecurePipe,
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe,
    ValidationMessagesComponent,
    EmailUnverifiedHintComponent,
    NavToolbarComponent,
    PhotoComponent,
    ProductComponent,
    ProductListRadioComponent,
    SearchResultComponent,
    ShowHidePasswordComponent,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent,
    TruncateNamePipe,
    BackgroundImageDirective,
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    BackgroundImageDirective,
    CreatorComponent,
    DashboardButtonComponent,
    DatetimeComponent,
    SecurePipe,
    AffiliateLinkDebugInfoComponent,
    WishImageComponent,
    OwnersInfoComponent,
    OwnerNamesPipe,
    ValidationMessagesComponent,
    EmailUnverifiedHintComponent,
    NavToolbarComponent,
    PhotoComponent,
    ProductComponent,
    ProductListRadioComponent,
    FormsModule,
    ReactiveFormsModule,
    SearchResultComponent,
    ShowHidePasswordComponent,
    TruncateNamePipe,
    UserInitialsComponent,
    WishListRadioComponent,
    WishShopInfoComponent,
    ListComponent
  ]
})
export class SharedModule { }
