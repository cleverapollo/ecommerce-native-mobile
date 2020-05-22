import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './secure.pipe';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { IonicModule } from '@ionic/angular';
import { EmailUnverifiedHintComponent } from './email-unverified-hint/email-unverified-hint.component';



@NgModule({
  declarations: [SecurePipe, OwnerNamesPipe, ValidationMessagesComponent, EmailUnverifiedHintComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [SecurePipe, OwnerNamesPipe, ValidationMessagesComponent, EmailUnverifiedHintComponent]
})
export class SharedModule { }
