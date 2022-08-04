import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {

  @Input() wish: SearchResultItem
  @Output() selectWish = new EventEmitter<SearchResultItem>();

  constructor(private browserService: BrowserService) { }

  addWish() {
    this.selectWish.emit(this.wish);
  }

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

}
