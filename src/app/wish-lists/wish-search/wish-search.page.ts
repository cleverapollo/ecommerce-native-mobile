import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '@core/api/search.service';
import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wish-search',
  templateUrl: './wish-search.page.html',
  styleUrls: ['./wish-search.page.scss'],
})
export class WishSearchPage implements OnInit, OnDestroy {

  private selectedWishList: WishListDto = null

  keywords: String
  loading: Boolean

  products: Array<SearchResultItem>

  constructor(
    private searchService: SearchService, 
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform
    ) { }

  ngOnInit() {
    this.products = [];
    this.selectedWishList = this.route.snapshot.data.wishList;
  }

  ngOnDestroy(): void {}

  search() {
    this.loading = true;
    this.searchService.searchForItems(this.keywords).subscribe({
      next: results => { this.products = results; },
      complete: () => { this.loading = false; }
    });
  }

  navigateToWishListNewPage(item: SearchResultItem) {
    let wish = SearchResultItemMapper.map(item, new WishDto());
    if (this.selectedWishList) {
      wish.wishListId = this.selectedWishList.id;
    }
    this.router.navigate(['wish-new'], {relativeTo: this.route, state: { searchResult: wish }});
  }

}
