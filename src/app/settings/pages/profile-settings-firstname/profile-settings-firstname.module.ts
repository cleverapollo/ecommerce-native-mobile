import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingsFirstnamePageRoutingModule } from './profile-settings-firstname-routing.module';

import { ProfileSettingsFirstnamePage } from './profile-settings-firstname.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ProfileSettingsFirstnamePageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileSettingsFirstnamePage]
})
export class ProfileSettingsFirstnamePageModule {}
