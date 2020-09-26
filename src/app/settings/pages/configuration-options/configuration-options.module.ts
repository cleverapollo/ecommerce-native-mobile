import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationOptionsPageRoutingModule } from './configuration-options-routing.module';

import { ConfigurationOptionsPage } from './configuration-options.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurationOptionsPageRoutingModule,
    SharedModule
  ],
  declarations: [ConfigurationOptionsPage]
})
export class ConfigurationOptionsPageModule {}
