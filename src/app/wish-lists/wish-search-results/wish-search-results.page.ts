import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchQuery, SearchResultDataService, SearchType } from '@core/services/search-result-data.service';
import { SearchResult, SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { ProductSearchService } from '@core/services/product-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WishDto } from '@core/models/wish-list.model';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { LogService } from '@core/services/log.service';
import { SearchService } from '@core/api/search.service';
import { PagingService } from '@core/services/paging.service';

@Component({
  selector: 'app-wish-search-results',
  templateUrl: './wish-search-results.page.html',
  styleUrls: ['./wish-search-results.page.scss'],
})
export class WishSearchResultsPage implements OnInit, OnDestroy, AfterViewInit {

  private _results: SearchResultItem[] = [];

  set results(value) {
    this.loading = false;
    this._results = value;
  } 
  get results(): SearchResultItem[] {
    return this._results
  };

  loading: Boolean;
  searchSuggestions = [
    "Spiegel Bestseller 2020",
    "Baby Geschenk",
    "Reiseführer",
    "Holzspielzeug",
    "Puzzle Spiele",
    "Hundespielzeug",
    "Bio Tee",
    "Kinderbuch ab 2 Jahre",
    "Nachtlicht Kinder",
    "Kugelbahn Holz"
  ]

  page: number = 1;
  maxPageCount: number = 1;

  searchByUrlForm: FormGroup;
  searchByAmazonApiForm: FormGroup;
  searchType: SearchType = SearchType.AMAZON_API;
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

  get keywords(): string {
    return this.searchByAmazonApiForm.controls.keywords.value;
  }

  set keywords(keywords: string) {
    this.searchByAmazonApiForm.controls.keywords.setValue(keywords);
  }

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private productSearchService: ProductSearchService,    
    private searchService: SearchService, 
    private formBuilder: FormBuilder,
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private route: ActivatedRoute,
    public platform: Platform,
    private logger: LogService,
    private pagingService: PagingService
  ) { }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.searchResultDataService.$lastSearchQuery.subscribe(query => {
      this.searchType = query.type;
      this.createForm(query.searchTerm);
      this.results = query.results;
      this.page = query.pageCount;
      this.maxPageCount = this.pagingService.calcMaxPageCount(query.totalResultCount);
      this.disableInfitineScrollIfNeeded();
    }, error => {
      this.logger.error(error);
      this.createForm('');
    });
  }

  ngAfterViewInit() {
    this.infiniteScroll.disabled = true
  }

  ionViewDidEnter() {
    this.removeSearchResultsAfterLeavingPage = true;
  }

  ionViewDidLeave() {
    if (this.removeSearchResultsAfterLeavingPage) {
      this.searchResultDataService.clear();
    }
  }

  searchByUrl() {
    const url = this.searchByUrlForm.controls.url.value;
    this.productSearchService.searchByUrl(url).then(searchResults => {
    }, this.logger.error);
  }

  searchByAmazonApi() {
    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.loading = true;
    this.searchService.searchForItems(this.keywords, this.page).subscribe({
      next: searchResult => {
        this.results = [];
        this.updateDisplayedSearchResults(searchResult)
        this.disableInfitineScrollIfNeeded();
      },
      error: this.logger.error,
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadMoreSearchResults(event) {
    this.page++;
    this.searchService.searchForItems(this.keywords, this.page).subscribe({
      next: searchResult => {
        this.updateDisplayedSearchResults(searchResult);
        if (this.page === this.maxPageCount) {
          // disable infinite scroll
          event.target.disabled = true;
        }
      },
      error: error => {
        this.logger.error(error);
        this.page--;
      },
      complete: () => {
        event.target.complete();
      }
    });
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

  onSearchSuggestionClick(suggestion: string) {
    this.keywords = suggestion;
  }

  private disableInfitineScrollIfNeeded() {
    if (this.page === this.maxPageCount && this.infiniteScroll) {
      // disable infinite scroll
      this.infiniteScroll.disabled = true;
    }
  }

  private updateDisplayedSearchResults(newSearchResult: SearchResult) {
    this.results = this.results.concat(newSearchResult.items);
    this.maxPageCount = this.pagingService.calcMaxPageCount(newSearchResult.totalResultCount);
    this.saveNewSearchResultState(newSearchResult.totalResultCount);
  }

  private saveNewSearchResultState(totalResultCount: number) {
    const searchQuery = new SearchQuery();
    searchQuery.searchTerm = this.keywords;
    searchQuery.type = SearchType.AMAZON_API;
    searchQuery.results = this.results;
    searchQuery.totalResultCount = totalResultCount;
    searchQuery.pageCount = this.page;
    this.searchResultDataService.update(searchQuery);
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

}
