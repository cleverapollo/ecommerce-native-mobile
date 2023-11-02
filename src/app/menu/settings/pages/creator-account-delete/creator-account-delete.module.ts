import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { CreatorAccountDeletePageRoutingModule } from './creator-account-delete-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorAccountDeletePage } from './creator-account-delete.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    CreatorAccountDeletePageRoutingModule
  ],
  declarations: [CreatorAccountDeletePage]
})
export class CreatorAccountDeletePageModule { }
