import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { BrowserService } from '@core/services/browser.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  @Input() wish: SearchResultItem
  @Output() onSelectWish = new EventEmitter<SearchResultItem>();

  constructor(private browserService: BrowserService) { }

  ngOnInit() {}

  selectWish() {
    this.onSelectWish.emit(this.wish);
  }

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

}
