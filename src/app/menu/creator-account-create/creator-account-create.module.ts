import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCreatorAccountPageRoutingModule } from './creator-account-create-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorAccountCreatePage } from './creator-account-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCreatorAccountPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorAccountCreatePage]
})
export class CreateCreatorAccountPageModule { }
