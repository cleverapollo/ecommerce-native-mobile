import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileImageUpdatePageRoutingModule } from './profile-image-update-routing.module';

import { ProfileImageUpdatePage } from './profile-image-update.page';
import { SharedModule } from 'src/app/shared/shared.module';

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
export class ProfileImageUpdatePageModule {}
