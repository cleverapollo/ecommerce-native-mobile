import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishEditPageRoutingModule } from './wish-edit-routing.module';

import { WishEditPage } from './wish-edit.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WishEditPageRoutingModule,
    SharedModule
  ],
  declarations: [WishEditPage]
})
export class WishEditPageModule {}
