import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResultItem } from '@core/models/search-result-item';
import { AnalyticsService } from '@core/services/analytics.service';
import { Logger } from '@core/services/log.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { WebPageCrawlerService } from '@core/services/web-page-crawler.service';
import { Observable, Subscription } from 'rxjs';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { UrlSearchDataStoreService } from '../url-search-data-store.service';

@Component({
  selector: 'app-wish-search-url-result-images',
  templateUrl: './wish-search-url-result-images.page.html',
  styleUrls: ['./wish-search-url-result-images.page.scss'],
})
export class WishSearchUrlResultImagesPage implements OnInit, OnDestroy {

  url: string;
  subscriptions: Subscription[] = [];

  products: SearchResultItem[] = [];
  selectedProduct: SearchResultItem;
  selectedIndex = -1;

  constructor(
    private router: Router,
    private logger: Logger,
    private changeDetector: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    private urlSearchDataStore: UrlSearchDataStoreService,
    private searchResultDataService: SearchResultDataService
  ) { }

  ngOnInit() {
    const subscription = this.searchResultDataService.$lastSearchQuery.subscribe(searchQuery => {
      this.products = searchQuery.results;
      this.changeDetector.markForCheck();
      this.changeDetector.detectChanges();
    });
    this.subscriptions.push(subscription);
  }

  ionViewWillEnter() {}

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search_by_url-picture');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  selectImage(product: SearchResultItem, index: number) {
    this.selectedProduct = product;
    this.selectedIndex = index;
    this.urlSearchDataStore.searchResultItem = product;
    this.urlSearchDataStore.formData.imageUrl = product.imageUrl;
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  next() {
    const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-url/edit-details`
    this.router.navigateByUrl(targetUrl, {
      state: {
        selectedProduct: this.selectedProduct
      }
    });
  }

}
