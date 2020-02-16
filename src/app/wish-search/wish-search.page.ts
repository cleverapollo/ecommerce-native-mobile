import { Component, OnInit, isDevMode } from '@angular/core';
import { SearchService } from '../shared/features/product-search/search.service';
import { SearchResultItem } from '../shared/features/product-search/search-result-item';

@Component({
  selector: 'app-wish-search',
  templateUrl: './wish-search.page.html',
  styleUrls: ['./wish-search.page.scss'],
})
export class WishSearchPage implements OnInit {

  keywords: String
  devMode: Boolean
  loading: Boolean

  products: Array<SearchResultItem>

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.devMode = isDevMode();
    this.products = [];
  }

  search() {
    this.loading = true;
    this.searchService.searchForItems(this.keywords).subscribe( results => {
      this.products = results;
    }, e => console.error(e), () => {
      this.loading = false;
    });
  }

}
