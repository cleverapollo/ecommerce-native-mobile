import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorDetailPublicPageRoutingModule } from './creator-detail-public-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorDetailPublicPage } from './creator-detail-public.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorDetailPublicPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorDetailPublicPage]
})
export class CreatorDetailPublicPageModule { }
