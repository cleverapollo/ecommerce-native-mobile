import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupCompletedPageRoutingModule } from './signup-completed-routing.module';

import { SignupCompletedPage } from './signup-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupCompletedPageRoutingModule
  ],
  declarations: [SignupCompletedPage]
})
export class SignupCompletedPageModule {}
