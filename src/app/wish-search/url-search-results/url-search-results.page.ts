import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResultItem } from '@core/models/search-result-item';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { PlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { createNavigationState, isOverviewPage } from '@wishSearch/wish-search.utils';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-url-search-results',
  templateUrl: './url-search-results.page.html',
  styleUrls: ['./url-search-results.page.scss'],
})
export class UrlSearchResultsPage implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean = false;

  get validationMessages(): ValidationMessages {
    return {
      url: [
        new ValidationMessage('required', 'Bitte gib eine URL ein.'),
        new ValidationMessage('pattern', 'Bitte gib eine valide URL an.')
      ]
    }
  };

  get showBackButton(): boolean {
    return !isOverviewPage(this.router.url);
  }

  get url(): string | null {
    return this.form?.controls.url.value ?? null;
  }

  set results(value) {
    this.loading = false;
    this._results = value;
  }

  get results(): SearchResultItem[] {
    return this._results
  };

  get hasResults(): boolean {
    return this.results.length > 0;
  }

  private _results: SearchResultItem[] = [];
  private _clearCache = true;
  private _subscription?: Subscription | null = null;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly productSearchService: ProductSearchService,
    private readonly logger: Logger,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this._subscription = this.productSearchService.$lastUrlSearchQuery.subscribe(query => {
      this._setupForm(query.searchTerm);
      this.results = query.results;
    }, error => {
      this.logger.error(error);
      this._setupForm();
    });
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search_url');
    this._clearCache = true;
  }

  ionViewDidLeave() {
    if (this._clearCache) {
      this.productSearchService.clearResults();
    }
  }

  search() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.loading = true;
    this.analyticsService.logSearchEvent(this.url);
    this.productSearchService.searchByUrl(this.url).pipe(
      first(),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: searchResult => {
        this.results = searchResult.items;
        this.analyticsService.logSearchResultEvent(searchResult, this.url);
        this.platformService.hideKeyBoard();
      },
      error: this.logger.error
    });
  }

  navigateToWishNewPage(item: SearchResultItem) {
    this._clearCache = false;
    this.router.navigate(['wish-new'], {
      relativeTo: this.route,
      state: createNavigationState(item, this.route.snapshot.data.wishList)
    });
  }

  private _setupForm(url?: string) {
    this.form = this.formBuilder.group({
      url: [url, {
        validators: [Validators.required, Validators.pattern(CustomValidation.urlRegex)],
        updateOn: 'submit'
      }]
    });
  }

}
