import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListNewPageRoutingModule } from './wish-list-create-update-routing.module';

import { WishListCreateUpdatePage } from './wish-list-create-update.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishListNewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListCreateUpdatePage]
})
export class WishListCreateUpdatePageModule {}
