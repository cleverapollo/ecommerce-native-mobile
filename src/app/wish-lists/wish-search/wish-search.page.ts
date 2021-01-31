import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SearchService } from '@core/api/search.service';
import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wish-search',
  templateUrl: './wish-search.page.html',
  styleUrls: ['./wish-search.page.scss'],
})
export class WishSearchPage implements OnInit, OnDestroy {

  private selectedWishList: WishListDto = null

  keywords: string
  page: number = 1;
  loading: Boolean

  products: Array<SearchResultItem>

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private searchService: SearchService, 
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform
    ) { }

  ngOnInit() {
    this.products = [];
    this.selectedWishList = this.route.snapshot.data.wishList;
    this.infiniteScroll.disabled = true
    console.log(this.infiniteScroll);
  }

  ngOnDestroy(): void {}

  search() {
    this.loading = true;
    this.searchService.searchForItems(this.keywords, this.page).subscribe({
      next: searchResult => { this.products = searchResult.items; },
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
