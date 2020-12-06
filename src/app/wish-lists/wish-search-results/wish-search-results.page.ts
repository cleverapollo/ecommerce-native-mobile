import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResultDataService, SearchType } from '@core/services/search-result-data.service';
import { SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { ProductSearchService } from '@core/services/product-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishDto } from '@core/models/wish-list.model';
import { Platform } from '@ionic/angular';
import { LogService } from '@core/services/log.service';

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
  searchType: SearchType;
  removeSearchResultsAfterLeavingPage: boolean = true;

  get showUrlForm(): boolean {
    return this.searchType === SearchType.URL;
  }

  get showKeywordsForm(): boolean {
    return this.searchType === SearchType.AMAZON_API;
  }

  get showBackButton(): boolean {
    return this.router.url !== '/secure/wish-search';
  }

  constructor(
    private productSearchService: ProductSearchService,     
    private formBuilder: FormBuilder,
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform,
    private logger: LogService
  ) { }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.loading = true;
    this.searchResultDataService.$lastSearchQuery.subscribe( query => {
      this.logger.log('search query', query);
      this.searchType = query.type;
      this.createForm(query.searchTerm);
      this.results = query.results;
    }, this.logger.error);
  }

  ionViewDidEnter() {
    this.removeSearchResultsAfterLeavingPage = true;
  }

  ionViewDidLeave() {
    if (this.removeSearchResultsAfterLeavingPage) {
      this.searchResultDataService.clear();
    }
  }

  private createForm(value: String) {
    switch (this.searchType) {
      case SearchType.AMAZON_API:
        this.logger.log('amazon api form');
        this.searchByAmazonApiForm = this.formBuilder.group({
          keywords: value
        });
        break;
      case SearchType.URL: 
      this.logger.log('url form');
        this.searchByUrlForm = this.formBuilder.group({
          url: value
        });
        break;
    }
  }

  searchByUrl() {
    const url = this.searchByUrlForm.controls.url.value;
    this.productSearchService.searchByUrl(url).then(searchResults => {
    }, this.logger.error);
  }

  searchByAmazonApi() {
    const keywords = this.searchByAmazonApiForm.controls.keywords.value;
    this.loading = true;
    this.productSearchService.searchByAmazonApi(keywords).then( results => {
      this.results = results;
    }, this.logger.error).finally(() => {
      this.loading = false;
    })
  }

  navigateToWishNewPage(item: SearchResultItem) {
    let wish = SearchResultItemMapper.map(item, new WishDto());
    const wishList = this.route.snapshot.data.wishList;
    if (wishList) {
      wish.wishListId = wishList.id;
    }
    this.removeSearchResultsAfterLeavingPage = false;
    this.router.navigate(['wish-new'], {relativeTo: this.route, state: { searchResult: wish }});
  }

}
