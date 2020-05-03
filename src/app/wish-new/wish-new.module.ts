import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishNewPageRoutingModule } from './wish-new-routing.module';

import { WishNewPage } from './wish-new.page';
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
  declarations: [WishNewPage]
})
export class WishNewPageModule {}
