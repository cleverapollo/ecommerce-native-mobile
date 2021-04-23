import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupMailOnePageRoutingModule } from './signup-mail-one-routing.module';

import { SignupMailOnePage } from './signup-mail-one.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupMailOnePageRoutingModule,
    SharedModule
  ],
  declarations: [SignupMailOnePage]
})
export class SignupMailOnePageModule {}
