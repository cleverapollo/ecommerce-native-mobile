import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsWishListOverviewPageRoutingModule } from './friends-wish-list-overview-routing.module';

import { FriendsWishListOverviewPage } from './friends-wish-list-overview.page';
import { FriendWishListComponent } from './friend-wish-list/friend-wish-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsWishListOverviewPageRoutingModule,
    SharedModule
  ],
  declarations: [FriendsWishListOverviewPage, FriendWishListComponent]
})
export class FriendsWishListOverviewPageModule {}
