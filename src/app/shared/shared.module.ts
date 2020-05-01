import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './secure.pipe';
import { OwnerNamesPipe } from './pipes/owner-names.pipe';
import { ValidationMessagesComponent } from './validation-messages/validation-messages.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [SecurePipe, OwnerNamesPipe, ValidationMessagesComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [SecurePipe, OwnerNamesPipe, ValidationMessagesComponent]
})
export class SharedModule { }
