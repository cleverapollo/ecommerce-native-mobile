import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorIntroTextUpdatePageRoutingModule } from './creator-intro-text-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorIntroTextUpdatePage } from './creator-intro-text-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorIntroTextUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorIntroTextUpdatePage]
})
export class CreatorIntroTextUpdatePageModule { }
