import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrlSearchResultsPageRoutingModule } from './url-search-results-routing.module';

import { SharedModule } from '@shared/shared.module';
import { UrlSearchResultsPage } from './url-search-results.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    UrlSearchResultsPageRoutingModule
  ],
  declarations: [UrlSearchResultsPage]
})
export class UrlSearchResultsPageModule { }
