import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishSearchSelectionPageRoutingModule } from './wish-search-selection-routing.module';

import { WishSearchSelectionPage } from './wish-search-selection.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishSearchSelectionPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchSelectionPage]
})
export class WishSearchSelectionPageModule {}
