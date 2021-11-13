import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WishSearchUrlResultDetailsPageRoutingModule } from './wish-search-url-result-details-routing.module';

import { WishSearchUrlResultDetailsPage } from './wish-search-url-result-details.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WishSearchUrlResultDetailsPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchUrlResultDetailsPage]
})
export class WishSearchUrlResultDetailsPageModule {}
