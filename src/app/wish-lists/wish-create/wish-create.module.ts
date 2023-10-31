import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { WishCreatePageRoutingModule } from './wish-create-routing.module';

import { SharedModule } from '@shared/shared.module';
import { WishCreatePage } from './wish-create.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    WishCreatePageRoutingModule
  ],
  declarations: [WishCreatePage]
})
export class WishCreatePageModule { }
