import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductListSharedPageRoutingModule } from './product-list-shared-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductListSharedPage } from './product-list-shared.page';

@NgModule({
  imports: [
    SharedModule,
    IonicModule,
    ProductListSharedPageRoutingModule
  ],
  declarations: [ProductListSharedPage]
})
export class ProductListSharedPageModule { }
