import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductUpdatePageRoutingModule } from './product-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductUpdatePage } from './product-update.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProductUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [ProductUpdatePage]
})
export class ProductUpdatePageModule { }
