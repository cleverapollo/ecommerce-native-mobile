import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishListEditPageRoutingModule } from './wish-list-edit-routing.module';

import { WishListEditPage } from './wish-list-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishListEditPageRoutingModule
  ],
  declarations: [WishListEditPage]
})
export class WishListEditPageModule {}
