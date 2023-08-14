import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListsPageRoutingModule } from './product-lists-routing.module';

import { ProductListsPage } from './product-lists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductListsPageRoutingModule
  ],
  declarations: [ProductListsPage]
})
export class ProductListsPageModule {}
