import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultComponent } from './search-result/search-result.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    exports: [
        SearchResultComponent
    ],
    declarations: [
        SearchResultComponent
    ]
  })
  export class ProductSearchModule {}