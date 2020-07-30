import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListGuestsPageRoutingModule } from './wish-list-guests-routing.module';

import { WishListGuestsPage } from './wish-list-guests.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    WishListGuestsPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListGuestsPage]
})
export class WishListGuestsPageModule {}
