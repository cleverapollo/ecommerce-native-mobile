import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorDetailPageRoutingModule } from './creator-detail-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorDetailPage } from './creator-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorDetailPage]
})
export class CreatorDetailPageModule { }
