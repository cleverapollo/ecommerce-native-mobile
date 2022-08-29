import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { WishSearchSelectionPageRoutingModule } from './wish-search-overview-routing.module';

import { WishSearchOverviewPage } from './wish-search-overview.page';
import { SharedModule } from '@shared/shared.module';
import { ShareExtensionExplanationComponent } from '../share-extension-explanation/share-extension-explanation.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WishSearchSelectionPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchOverviewPage, ShareExtensionExplanationComponent]
})
export class WishSearchSelectionPageModule {}
