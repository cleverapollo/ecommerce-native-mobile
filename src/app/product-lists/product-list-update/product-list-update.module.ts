import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductListUpdatePageRoutingModule } from './product-list-update-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductListUpdatePage } from './product-list-update.page';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    ProductListUpdatePageRoutingModule
  ],
  declarations: [ProductListUpdatePage]
})
export class ProductListUpdatePageModule { }
