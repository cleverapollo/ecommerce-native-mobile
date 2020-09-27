import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchPageRoutingModule } from './wish-search-routing.module';

import { WishSearchPage } from './wish-search.page';
import { ProductSearchModule } from '@shared/features/product-search/product-search.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductSearchModule,
    WishSearchPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchPage]
})
export class WishSearchPageModule {}
