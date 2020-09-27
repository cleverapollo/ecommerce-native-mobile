import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishNewPageRoutingModule } from './wish-create-update-routing.module';

import { WishCreateUpdatePage } from './wish-create-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishNewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishCreateUpdatePage]
})
export class WishCreateUpdatePageModule {}
