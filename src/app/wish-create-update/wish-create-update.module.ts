import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishNewPageRoutingModule } from './wish-create-update-routing.module';

import { WishCreateUpdatePage } from './wish-create-update.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishNewPageRoutingModule,
    SharedModule
  ],
  declarations: [WishCreateUpdatePage]
})
export class WishCreateUpdatePageModule {}
