import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishDetailPageRoutingModule } from './wish-detail-routing.module';

import { WishDetailPage } from './wish-detail.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [WishDetailPage]
})
export class WishDetailPageModule {}
