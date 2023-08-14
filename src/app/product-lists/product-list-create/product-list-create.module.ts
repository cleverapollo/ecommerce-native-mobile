import { NgModule } from '@angular/core';

import { ProductListCreatePageRoutingModule } from './product-list-create-routing.module';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { ProductListCreatePage } from './product-list-create.page';

@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    ProductListCreatePageRoutingModule
  ],
  declarations: [ProductListCreatePage]
})
export class ProductListCreatePageModule { }
