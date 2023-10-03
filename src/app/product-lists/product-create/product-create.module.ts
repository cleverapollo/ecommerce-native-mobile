import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { ProductCreatePageRoutingModule } from './product-create-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ProductCreatePage } from './product-create.page';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    ProductCreatePageRoutingModule
  ],
  declarations: [ProductCreatePage]
})
export class ProductCreatePageModule { }
