import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResultItem } from '@core/models/search-result-item';
import { BrowserService } from '@core/services/browser.service';
import { WishImageComponentStyles } from '../wish-image/wish-image.component';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {

  @Input() wish: SearchResultItem
  @Output() selectWish = new EventEmitter<SearchResultItem>();

  constructor(private browserService: BrowserService) { }

  get imgStyles(): WishImageComponentStyles {
    return {
      img: {
        'padding-top': '8px',
        'max-height': 'inherit'
      },
      container: {
        'max-height': 'inherit'
      }
    }
  }

  addWish() {
    this.selectWish.emit(this.wish);
  }

  openProductURL() {
    const url = this.wish.productUrl;
    this.browserService.openInAppBrowser(url);
  }

}
