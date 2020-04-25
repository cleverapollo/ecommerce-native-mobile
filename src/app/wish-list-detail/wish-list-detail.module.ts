import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListDetailPageRoutingModule } from './wish-list-detail-routing.module';

import { WishListDetailPage } from './wish-list-detail.page';
import { WishComponent } from './wish/wish.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishListDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListDetailPage, WishComponent]
})
export class WishListDetailPageModule {}
