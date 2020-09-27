import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsHomePageRoutingModule } from './friends-home-routing.module';

import { FriendsHomePage } from './friends-home.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsHomePageRoutingModule,
    SharedModule
  ],
  declarations: [FriendsHomePage]
})
export class FriendsHomePageModule {}
