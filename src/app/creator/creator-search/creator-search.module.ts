import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatorSearchPageRoutingModule } from './creator-search-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreatorSearchPage } from './creator-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatorSearchPageRoutingModule,
    SharedModule
  ],
  declarations: [CreatorSearchPage]
})
export class CreatorSearchPageModule { }
