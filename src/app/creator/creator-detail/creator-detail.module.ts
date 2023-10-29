import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorDetailPageRoutingModule } from './creator-detail-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorDetailPage } from './creator-detail.page';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorDetailPage, ProductListComponent]
})
export class CreatorDetailPageModule { }
