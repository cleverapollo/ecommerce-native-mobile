import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductSearchAmazonPageRoutingModule } from './product-search-amazon-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductSearchAmazonPage } from './product-search-amazon.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductSearchAmazonPageRoutingModule
  ],
  declarations: [ProductSearchAmazonPage]
})
export class ProductSearchAmazonPageModule { }
