import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishUpdatePageRoutingModule } from './wish-update-routing.module';

import { WishUpdatePage } from './wish-update.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IonicModule,
    WishUpdatePageRoutingModule
  ],
  declarations: [WishUpdatePage]
})
export class WishUpdatePageModule {}
