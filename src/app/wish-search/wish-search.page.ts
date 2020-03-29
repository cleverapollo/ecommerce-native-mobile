import { Component, OnInit, isDevMode, OnDestroy } from '@angular/core';
import { SearchService } from '../shared/features/product-search/search.service';
import { SearchResultItem } from '../shared/features/product-search/search-result-item';
import { WishListService } from '../shared/services/wish-list.service';
import { Wish } from '../home/wishlist.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WishListDto } from '../shared/models/wish-list.model';

@Component({
  selector: 'app-wish-search',
  templateUrl: './wish-search.page.html',
  styleUrls: ['./wish-search.page.scss'],
})
export class WishSearchPage implements OnInit, OnDestroy {

  private selectedWishList: WishListDto = null
  private wishListSubscription: Subscription

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
    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe( w => {
      this.selectedWishList = w;
    });
  }

  ngOnDestroy(): void {
    this.wishListSubscription.unsubscribe();
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
    wish.wishListId = this.selectedWishList ? this.selectedWishList.id : null;
    this.wishListService.updateSelectedWish(wish);
    this.router.navigate(['wish-new']);
  }

}
