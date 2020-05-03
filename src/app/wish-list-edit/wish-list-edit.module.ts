import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListEditPageRoutingModule } from './wish-list-edit-routing.module';

import { WishListEditPage } from './wish-list-edit.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishListEditPageRoutingModule,
    SharedModule
  ],
  declarations: [WishListEditPage]
})
export class WishListEditPageModule {}
