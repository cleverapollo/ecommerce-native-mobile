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

@NgModule({
  declarations: [
    SecurePipe, 
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    CacheImagePipe, 
    HintComponent,
    NavToolbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    SecurePipe, 
    OwnerNamesPipe, 
    ValidationMessagesComponent, 
    EmailUnverifiedHintComponent, 
    CacheImagePipe, 
    HintComponent,
    NavToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
