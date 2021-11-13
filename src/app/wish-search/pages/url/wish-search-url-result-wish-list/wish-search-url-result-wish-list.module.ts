import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultWishListPageRoutingModule } from './wish-search-url-result-wish-list-routing.module';

import { WishSearchUrlResultWishListPage } from './wish-search-url-result-wish-list.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishSearchUrlResultWishListPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchUrlResultWishListPage]
})
export class WishSearchUrlResultWishListPageModule {}
