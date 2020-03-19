import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsWishListDetailPageRoutingModule } from './friends-wish-list-detail-routing.module';

import { FriendsWishListDetailPage } from './friends-wish-list-detail.page';
import { FriendsWishComponent } from './friends-wish/friends-wish.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsWishListDetailPageRoutingModule
  ],
  declarations: [FriendsWishListDetailPage, FriendsWishComponent]
})
export class FriendsWishListDetailPageModule {}
