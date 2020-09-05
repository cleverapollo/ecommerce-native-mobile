import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchSelectionPageRoutingModule } from './wish-search-selection-routing.module';

import { WishSearchSelectionPage } from './wish-search-selection.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    WishSearchSelectionPageRoutingModule
  ],
  declarations: [WishSearchSelectionPage]
})
export class WishSearchSelectionPageModule {}
