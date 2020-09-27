import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingsFirstnamePageRoutingModule } from './profile-settings-firstname-routing.module';

import { ProfileSettingsFirstnamePage } from './profile-settings-firstname.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProfileSettingsFirstnamePageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileSettingsFirstnamePage]
})
export class ProfileSettingsFirstnamePageModule {}
