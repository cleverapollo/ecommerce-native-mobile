import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorUserNameUpdatePageRoutingModule } from './creator-user-name-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorUserNameUpdatePage } from './creator-user-name-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorUserNameUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorUserNameUpdatePage]
})
export class CreatorUserNameUpdatePageModule { }
