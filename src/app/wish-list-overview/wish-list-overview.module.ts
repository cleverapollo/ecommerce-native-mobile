import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListOverviewPageRoutingModule } from './wish-list-overview-routing.module';

import { WishListOverviewPage } from './wish-list-overview.page';
import { WishListComponent } from './wish-list/wish-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishListOverviewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListOverviewPage, WishListComponent]
})
export class WishListOverviewPageModule {}
