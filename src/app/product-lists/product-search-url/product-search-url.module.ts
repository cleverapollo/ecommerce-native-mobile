import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductSearchUrlPageRoutingModule } from './product-search-url-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductSearchUrlPage } from './product-search-url.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductSearchUrlPageRoutingModule
  ],
  declarations: [ProductSearchUrlPage]
})
export class ProductSearchUrlPageModule { }
