import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishEditPageRoutingModule } from './wish-edit-routing.module';

import { WishEditPage } from './wish-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishEditPageRoutingModule
  ],
  declarations: [WishEditPage]
})
export class WishEditPageModule {}
