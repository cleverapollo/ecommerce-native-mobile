import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailConfirmationPageRoutingModule } from './email-confirmation-routing.module';

import { EmailConfirmationPage } from './email-confirmation.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailConfirmationPageRoutingModule,
    SharedModule
  ],
  declarations: [EmailConfirmationPage]
})
export class EmailConfirmationPageModule {}
