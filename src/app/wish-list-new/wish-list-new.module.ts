import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListNewPageRoutingModule } from './wish-list-new-routing.module';

import { WishListNewPage } from './wish-list-new.page';
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
  declarations: [WishListNewPage]
})
export class WishListNewPageModule {}
