import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductSearchOverviewPageRoutingModule } from './product-search-overview-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductSearchOverviewPage } from './product-search-overview.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductSearchOverviewPageRoutingModule
  ],
  declarations: [ProductSearchOverviewPage]
})
export class ProductSearchOverviewPageModule { }
