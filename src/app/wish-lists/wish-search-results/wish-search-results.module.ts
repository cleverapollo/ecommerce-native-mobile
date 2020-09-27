import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchResultsPageRoutingModule } from './wish-search-results-routing.module';

import { WishSearchResultsPage } from './wish-search-results.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    WishSearchResultsPageRoutingModule
  ],
  declarations: [WishSearchResultsPage]
})
export class WishSearchResultsPageModule {}
