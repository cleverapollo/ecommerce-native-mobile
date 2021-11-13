import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultImagesPageRoutingModule } from './wish-search-url-result-images-routing.module';

import { WishSearchUrlResultImagesPage } from './wish-search-url-result-images.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishSearchUrlResultImagesPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchUrlResultImagesPage]
})
export class WishSearchUrlResultImagesPageModule {}
