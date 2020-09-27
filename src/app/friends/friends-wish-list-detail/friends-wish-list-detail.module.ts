import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsWishListDetailPageRoutingModule } from '@friends/friends-wish-list-detail/friends-wish-list-detail-routing.module';

import { FriendsWishListDetailPage } from '@friends/friends-wish-list-detail/friends-wish-list-detail.page';
import { FriendsWishComponent } from './friends-wish/friends-wish.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsWishListDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [FriendsWishListDetailPage, FriendsWishComponent]
})
export class FriendsWishListDetailPageModule {}
