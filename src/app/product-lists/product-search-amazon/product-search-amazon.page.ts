import { AfterViewInit, Component, OnDestroy, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResult, SearchResultItem } from '@core/models/search-result-item';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { PagingService } from '@core/services/paging.service';
import { PlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { SearchType } from '@core/services/search-result-data.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-search-amazon',
  templateUrl: './product-search-amazon.page.html',
  styleUrls: ['./product-search-amazon.page.scss'],
})
export class ProductSearchAmazonPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  page = 1;
  maxPageCount = 1;

  form: FormGroup;
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

  get keywords(): string {
    return this.form.controls.keywords.value;
  }

  set keywords(keywords: string) {
    this.form.controls.keywords.setValue(keywords);
  }

  trackByAsin: TrackByFunction<SearchResultItem> = (idx, result) => result.asin;

  private _results: SearchResultItem[] = [];
  private _clearCache = true;
  private _subscription = new Subscription();

  constructor(
    private searchService: ProductSearchService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private logger: Logger,
    private pagingService: PagingService,
    private analyticsService: AnalyticsService,
    private platformService: PlatformService
  ) { }

  ngOnInit() {
    this._subscription.add(this.searchService.$lastAmazonSearchQuery.subscribe({
      next: query => {
        this._createForm(query.searchTerm);
        this.results = query.results;
        this.page = query.pageCount;
        this.maxPageCount = this.pagingService.calcMaxPageCount(query.totalResultCount);
        this._disableInfitineScrollIfNeeded();
      },
      error: error => {
        this.logger.error(error);
        this._createForm('');
      }
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.infiniteScroll.disabled = this._results?.length === 0;
  }

  ionViewDidEnter(): void {
    this.analyticsService.setFirebaseScreenName('search_amazon');
    this._clearCache = true;
  }

  ionViewDidLeave(): void {
    if (this._clearCache) {
      this.searchService.clearResults();
    }
  }

  search(): void {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.loading = true;
    this.analyticsService.logSearchEvent(this.keywords);
    this.searchService.searchByAmazonApi(this.keywords, this.page).pipe(
      first(),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: searchResult => {
        this.results = [];
        this.analyticsService.logSearchResultEvent(searchResult, this.keywords);
        this._updateDisplayedSearchResults(searchResult)
        this._disableInfitineScrollIfNeeded();
        this.platformService.hideKeyBoard();
      },
      error: this.logger.error
    });
  }

  loadMoreSearchResults(event): void {
    this.page++;
    this.searchService.searchByAmazonApi(this.keywords, this.page).subscribe({
      next: searchResult => {
        this._updateDisplayedSearchResults(searchResult);
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

  navigateToProductNewPage(item: SearchResultItem): void {
    this._clearCache = false;
    this.router.navigate(['product-new'], {
      relativeTo: this.route,
      state: {
        searchResult: {
          ...item,
          productListId: this.router.getCurrentNavigation()?.extras.state?.productList?.id
        }
      }
    });
  }

  onSearchSuggestionClick(suggestion: string): void {
    this.keywords = suggestion;
    this.search();
  }

  private _disableInfitineScrollIfNeeded(): void {
    if (this.page === this.maxPageCount && this.infiniteScroll) {
      // disable infinite scroll
      this.infiniteScroll.disabled = true;
    }
  }

  private _updateDisplayedSearchResults(newSearchResult: SearchResult): void {
    this.results = this.results.concat(newSearchResult.items);
    this.maxPageCount = this.pagingService.calcMaxPageCount(newSearchResult.totalResultCount);
    this.searchService.updateResults({
      searchTerm: this.keywords,
      type: SearchType.AMAZON_API,
      results: this.results,
      totalResultCount: newSearchResult.totalResultCount,
      pageCount: this.page
    });
  }

  private _createForm(value: string): void {
    this.form = this.formBuilder.group({
      keywords: [value, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }]
    });
  }

}
