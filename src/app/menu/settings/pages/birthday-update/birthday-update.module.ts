import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BirthdayUpdatePageRoutingModule } from './birthday-update-routing.module';

import { BirthdayUpdatePage } from './birthday-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    BirthdayUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [BirthdayUpdatePage]
})
export class BirthdayUpdatePageModule {}
