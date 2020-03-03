import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result/search-result.component';
import { IonicModule } from '@ionic/angular';
import { SearchResultDetailModalComponent } from './search-result-detail-modal/search-result-detail-modal.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [
        SearchResultComponent
    ],
    declarations: [
        SearchResultComponent,
        SearchResultDetailModalComponent
    ],
    entryComponents: [
        SearchResultDetailModalComponent
    ]
  })
  export class ProductSearchModule {}