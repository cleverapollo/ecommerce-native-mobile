import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { LastNameUpdatePageRoutingModule } from './last-name-update-routing.module';

import { LastNameUpdatePage } from './last-name-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LastNameUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [LastNameUpdatePage]
})
export class LastNameUpdatePageModule {}
