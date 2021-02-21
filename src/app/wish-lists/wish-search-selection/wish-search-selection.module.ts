import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishSearchSelectionPageRoutingModule } from './wish-search-selection-routing.module';

import { WishSearchSelectionPage } from './wish-search-selection.page';
import { SharedModule } from '@shared/shared.module';
import { OnboardingSlidesComponent } from './onboarding-slides/onboarding-slides.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishSearchSelectionPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchSelectionPage, OnboardingSlidesComponent]
})
export class WishSearchSelectionPageModule {}
