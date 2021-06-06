import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupMailTwoPageRoutingModule } from './signup-mail-two-routing.module';

import { SignupMailTwoPage } from './signup-mail-two.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupMailTwoPageRoutingModule,
    SharedModule
  ],
  declarations: [SignupMailTwoPage]
})
export class SignupMailTwoPageModule {}
