import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListOverviewPageRoutingModule } from './product-list-overview-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductListOverviewPage } from './product-list-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductListOverviewPageRoutingModule,
    SharedModule
  ],
  declarations: [ProductListOverviewPage]
})
export class ProductListOverviewPageModule { }
