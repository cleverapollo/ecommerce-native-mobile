import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResultDataService, SearchType } from '@core/services/search-result-data.service';
import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { ProductSearchService } from '@core/services/product-search.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WishDto } from '@core/models/wish-list.model';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-wish-search-results',
  templateUrl: './wish-search-results.page.html',
  styleUrls: ['./wish-search-results.page.scss'],
})
export class WishSearchResultsPage implements OnInit, OnDestroy {

  private _results: SearchResultItem[] = [];

  set results(value) {
    this.loading = false;
    this._results = value;
  } 
  get results(): SearchResultItem[] {
    return this._results
  };

  loading: Boolean;
  searchByUrlForm: FormGroup;
  searchByAmazonApiForm: FormGroup;
  searchType: SearchType

  get showUrlForm(): boolean {
    return this.searchType === SearchType.URL;
  }

  get showKeywordsForm(): boolean {
    return this.searchType === SearchType.AMAZON_API;
  }

  constructor(
    private productSearchService: ProductSearchService,     
    private formBuilder: FormBuilder,
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform
  ) { }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.loading = true;
    this.searchResultDataService.$lastSearchQuery.subscribe( query => {
      console.log('search query', query);
      this.searchType = query.type;
      this.createForm(query.searchTerm);
      this.results = query.results;
    }, console.error);
  }

  private createForm(value: String) {
    switch (this.searchType) {
      case SearchType.AMAZON_API:
        console.log('amazon api form');
        this.searchByAmazonApiForm = this.formBuilder.group({
          keywords: value
        });
        break;
      case SearchType.URL: 
      console.log('url form');
        this.searchByUrlForm = this.formBuilder.group({
          url: value
        });
        break;
    }
  }

  searchByUrl() {
    const url = this.searchByUrlForm.controls.url.value;
    this.productSearchService.searchByUrl(url).then(searchResults => {
    }, console.error);
  }

  searchByAmazonApi() {
    const keywords = this.searchByAmazonApiForm.controls.keywords.value;
    this.loading = true;
    this.productSearchService.searchByAmazonApi(keywords).then( results => {
      this.results = results;
    }, console.error).finally(() => {
      this.loading = false;
    })
  }

  navigateToWishNewPage(item: SearchResultItem) {
    let wish = SearchResultItemMapper.map(item, new WishDto());
    const wishList = this.route.snapshot.data.wishList;
    if (wishList) {
      wish.wishListId = wishList.id;
    }
    console.log('search result', wish);
    this.router.navigate(['wish-new'], {relativeTo: this.route, state: { searchResult: wish }});
  }

}
