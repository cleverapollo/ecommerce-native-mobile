import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { EmailUpdatePageRoutingModule } from './email-update-routing.module';

import { EmailUpdatePage } from './email-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmailUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [EmailUpdatePage]
})
export class EmailUpdatePageModule {}
