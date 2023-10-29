import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { CreatorProductListDetailPageRoutingModule } from './creator-product-list-detail-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorProductListDetailPage } from './creator-product-list-detail.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    CreatorProductListDetailPageRoutingModule
  ],
  declarations: [CreatorProductListDetailPage]
})
export class CreatorProductListDetailPageModule { }
