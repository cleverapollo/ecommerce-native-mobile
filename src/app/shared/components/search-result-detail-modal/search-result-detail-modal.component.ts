import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchResultItem } from '@core/models/search-result-item';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-search-result-detail-modal',
  templateUrl: './search-result-detail-modal.component.html',
  styleUrls: ['./search-result-detail-modal.component.scss'],
})
export class SearchResultDetailModalComponent {

  @Input() searchResultItem: SearchResultItem

  constructor(
    private modalController: ModalController, 
    private browserService: BrowserService
  ) { }
  
  dismiss() {
    this.modalController.dismiss();
  }

  selectWish() {
    this.modalController.dismiss({
      selectWish: true
    });
  }

  openProductURL() {
    const url = this.searchResultItem.productUrl;
    this.browserService.openInAppBrowser(url);
  }

}
