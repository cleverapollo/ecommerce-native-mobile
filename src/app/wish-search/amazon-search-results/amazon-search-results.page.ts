import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { SearchService } from '@core/api/search.service';
import { SearchResult, SearchResultItem, SearchResultItemMapper } from '@core/models/search-result-item';
import { WishDto, WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { PagingService } from '@core/services/paging.service';
import { SearchQuery, SearchResultDataService, SearchType } from '@core/services/search-result-data.service';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-amazon-search-results',
  templateUrl: './amazon-search-results.page.html',
  styleUrls: ['./amazon-search-results.page.scss'],
})
export class AmazonSearchResultsPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  page = 1;
  maxPageCount = 1;

  form: FormGroup;
  removeSearchResultsAfterLeavingPage = true;
  loading = false;

  searchSuggestions = [
    'Spiegel Bestseller',
    'Baby Geschenk',
    'Reiseführer',
    'Holzspielzeug',
    'Puzzle Spiele',
    'Hundespielzeug',
    'Bio Tee',
    'Kinderbuch ab 2 Jahre',
    'Nachtlicht Kinder',
    'Kugelbahn Holz'
  ]

  set results(value) {
    this.loading = false;
    this._results = value;
  }
  get results(): SearchResultItem[] {
    return this._results
  };

  get validationMessages(): ValidationMessages {
    return {
      keywords: [
        new ValidationMessage('required', 'Bitte gib einen Suchbegriff ein.'),
        new ValidationMessage('minlength', 'Bitte gib min. 2 Zeichen an.')
      ]
    }
  };

  get showBackButton(): boolean {
    return this.router.url !== '/secure/wish-search';
  }

  get keywords(): string {
    return this.form.controls.keywords.value;
  }

  set keywords(keywords: string) {
    this.form.controls.keywords.setValue(keywords);
  }

  private _results: SearchResultItem[] = [];
  private subscription?: Subscription

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private searchResultDataService: SearchResultDataService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: Logger,
    private pagingService: PagingService,
    private analyticsService: AnalyticsService,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.subscription = this.searchResultDataService.$lastSearchQuery.subscribe(query => {
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.infiniteScroll.disabled = this._results.length === 0;
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search');
    this.removeSearchResultsAfterLeavingPage = true;
  }

  ionViewDidLeave() {
    if (this.removeSearchResultsAfterLeavingPage) {
      this.searchResultDataService.clear();
    }
  }

  search() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.loading = true;
    this.logSearchEvent();
    this.searchService.searchForItems(this.keywords, this.page).pipe(
      first(),
      finalize(() => {
        this.logger.debug('searchByAmazonApi complete');
        this.loading = false;
      })
    ).subscribe({
      next: searchResult => {
        this.results = [];
        this.logSearchResultEvent(searchResult);
        this.updateDisplayedSearchResults(searchResult)
        this.disableInfitineScrollIfNeeded();
        if (this.platform.is('hybrid')) {
          Keyboard.hide();
        }
      },
      error: this.logger.error
    });
  }

  private logSearchResultEvent(searchResult: SearchResult) {
    this.analyticsService.logAppsflyerEvent('af_search', {
      af_search_string: this.keywords,
      af_content_list: searchResult.items.map(item => item.asin)
    });
    this.analyticsService.logFirebaseEvent('search', {
      search_term: this.keywords,
      items: searchResult.items.map(item => {
        return {
          item_id: item.asin,
          item_name: item.name,
          price: item.price
        };
      })
    });
  }

  private logSearchEvent() {
    this.analyticsService.logAppsflyerEvent('af_search', {
      af_search_string: this.keywords
    });
    this.analyticsService.logFirebaseEvent('search', {
      search_term: this.keywords
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
    const wish = SearchResultItemMapper.map(item, new WishDto());
    const wishList: WishListDto = this.route.snapshot.data.wishList;
    if (wishList) {
      wish.wishListId = wishList.id;
    }
    this.removeSearchResultsAfterLeavingPage = false;
    this.router.navigate(['wish-new'], {relativeTo: this.route, state: { searchResult: wish }});
  }

  onSearchSuggestionClick(suggestion: string) {
    this.keywords = suggestion;
    this.search();
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

  private createForm(value: string) {
    this.form = this.formBuilder.group({
      keywords: [value, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }]
    });
  }

}
