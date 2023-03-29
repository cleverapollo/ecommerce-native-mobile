import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorAccountInfoPageRoutingModule } from './creator-account-info-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorAccountInfoPage } from './creator-account-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorAccountInfoPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorAccountInfoPage]
})
export class CreatorAccountInfoPageModule { }
