import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '@core/api/search.service';
import { SearchResultItem } from '@core/models/search-result-item';
import { WishListService } from '@core/services/wish-list.service';
import { Subscription } from 'rxjs';
import { WishListDto, WishDto } from '@core/models/wish-list.model';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-wish-search',
  templateUrl: './wish-search.page.html',
  styleUrls: ['./wish-search.page.scss'],
})
export class WishSearchPage implements OnInit, OnDestroy {

  private selectedWishList: WishListDto = null
  private wishListSubscription: Subscription

  keywords: String
  loading: Boolean

  products: Array<SearchResultItem>

  constructor(
    private navController: NavController,
    private searchService: SearchService, 
    private wishListService: WishListService,
    public platform: Platform
    ) { }

  ngOnInit() {
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
    let wish = new WishDto();
    wish.name = item.name;
    wish.price = item.price;
    wish.imageUrl = item.imageUrl;
    wish.productUrl = item.productUrl;
    wish.wishListId = this.selectedWishList ? this.selectedWishList.id : null;
    this.wishListService.updateSelectedWish(wish);
    this.navController.navigateForward('secure/wish-search/wish-new');
  }

}
