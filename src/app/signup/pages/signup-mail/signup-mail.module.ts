import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupMailPageRoutingModule } from './signup-mail-routing.module';

import { SignupMailPage } from './signup-mail.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupMailPageRoutingModule,
    SharedModule
  ],
  declarations: [SignupMailPage]
})
export class SignupMailPageModule {}
