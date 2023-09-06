import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductListSharedPageRoutingModule } from './product-list-shared-routing.module';

import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ProductListSharedPage } from './product-list-shared.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductListSharedPageRoutingModule
  ],
  declarations: [ProductListSharedPage]
})
export class ProductListSharedPageModule { }
