import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishListNewPageRoutingModule } from './wish-list-update-routing.module';

import { WishListUpdatePage } from './wish-list-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishListNewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListUpdatePage]
})
export class WishListUpdatePageModule {}
