import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { WishSearchSelectionPageRoutingModule } from './wish-search-overview-routing.module';

import { SharedModule } from '@shared/shared.module';
import { ShareExtensionExplanationComponent } from '../share-extension-explanation/share-extension-explanation.component';
import { WishSearchOverviewPage } from './wish-search-overview.page';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
    WishSearchSelectionPageRoutingModule,
    SharedModule
  ],
  declarations: [WishSearchOverviewPage, ShareExtensionExplanationComponent]
})
export class WishSearchSelectionPageModule { }
