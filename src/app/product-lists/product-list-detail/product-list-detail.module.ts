import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductListDetailPageRoutingModule } from './product-list-detail-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductListDetailPage } from './product-list-detail.page';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    ProductListDetailPageRoutingModule
  ],
  declarations: [ProductListDetailPage]
})
export class ProductListDetailPageModule { }
