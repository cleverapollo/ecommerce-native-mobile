import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PasswordUpdatePageRoutingModule } from './password-update-routing.module';

import { PasswordUpdatePage } from './password-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PasswordUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [PasswordUpdatePage]
})
export class PasswordUpdatePageModule {}
