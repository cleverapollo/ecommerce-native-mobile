import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListCreatePageRoutingModule } from './wish-list-create-routing.module';

import { WishListCreatePage } from './wish-list-create.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishListCreatePageRoutingModule,
    SharedModule
  ],
  declarations: [WishListCreatePage]
})
export class WishListCreatePageModule {}
