import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileImageUpdatePageRoutingModule } from './profile-image-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProfileImageUpdatePage } from './profile-image-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileImageUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [ProfileImageUpdatePage]
})
export class ProfileImageUpdatePageModule { }
