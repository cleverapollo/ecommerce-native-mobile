import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailUpdatePageRoutingModule } from './email-update-routing.module';

import { EmailUpdatePage } from './email-update.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EmailUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [EmailUpdatePage]
})
export class EmailUpdatePageModule {}
