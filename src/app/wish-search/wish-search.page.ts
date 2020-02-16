import { Component, OnInit, isDevMode } from '@angular/core';
import { SearchService } from '../shared/features/product-search/search.service';
import { SearchResultItem } from '../shared/features/product-search/search-result-item';
import { WishListService } from '../shared/services/wish-list.service';
import { Wish } from '../home/wishlist.model';
import { Router } from '@angular/router';

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

  constructor(
    private searchService: SearchService, 
    private wishListService: WishListService,
    private router: Router
    ) { }

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

  updateValue(item: SearchResultItem) {
    let wish = new Wish();
    wish.name = item.name;
    wish.price = item.price;
    wish.imageUrl = item.imageUrl;
    wish.productUrl = item.productUrl;
    wish.wishListId = 0;
    this.wishListService.updateSelectedWish(wish);
    this.router.navigate(['wish-new']);
  }

}
