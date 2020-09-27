import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchResultsPageRoutingModule } from './wish-search-results-routing.module';

import { WishSearchResultsPage } from './wish-search-results.page';
import { SharedModule } from '@shared/shared.module';
import { ProductSearchModule } from '@shared/features/product-search/product-search.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    WishSearchResultsPageRoutingModule,
    ProductSearchModule
  ],
  declarations: [WishSearchResultsPage]
})
export class WishSearchResultsPageModule {}
