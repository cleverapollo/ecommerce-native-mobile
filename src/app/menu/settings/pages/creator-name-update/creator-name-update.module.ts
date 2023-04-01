import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorNameUpdatePageRoutingModule } from './creator-name-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorNameUpdatePage } from './creator-name-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorNameUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorNameUpdatePage]
})
export class CreatorNameUpdatePageModule { }
