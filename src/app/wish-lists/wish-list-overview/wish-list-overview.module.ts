import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListOverviewPageRoutingModule } from './wish-list-overview-routing.module';

import { SharedModule } from '@shared/shared.module';
import { WishListOverviewPage } from './wish-list-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishListOverviewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListOverviewPage]
})
export class WishListOverviewPageModule { }
