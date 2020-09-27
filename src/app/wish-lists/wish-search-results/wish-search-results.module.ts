import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishSearchResultsPageRoutingModule } from './wish-search-results-routing.module';

import { WishSearchResultsPage } from './wish-search-results.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishSearchResultsPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchResultsPage]
})
export class WishSearchResultsPageModule {}
