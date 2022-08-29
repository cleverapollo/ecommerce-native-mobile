import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishApiService } from '@core/api/wish-api.service';
import { SearchResultItem } from '@core/models/search-result-item';
import { WishDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { WebPageCrawlerService } from '@core/services/web-page-crawler.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { finalize, first, tap } from 'rxjs/operators';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { UrlSearchDataStoreService } from '../url-search-data-store.service';

@Component({
  selector: 'app-wish-search-url-result-wish-list',
  templateUrl: './wish-search-url-result-wish-list.page.html',
  styleUrls: ['./wish-search-url-result-wish-list.page.scss'],
})
export class WishSearchUrlResultWishListPage implements OnInit {

  form: FormGroup;
  selectedProduct: SearchResultItem

  get validationMessages(): ValidationMessages {
    return {
      wishListId: [
        new ValidationMessage('required', 'Dein Wunsch muss einer Wunschliste zugeordnet sein.')
      ]
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private analyticsService: AnalyticsService,
    private router: Router,
    private wishService: WishApiService,
    private urlSearchDataStore: UrlSearchDataStoreService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private wishListStore: WishListStoreService,
    private webPageCrawler: WebPageCrawlerService
  ) { }

  ngOnInit() {
    this.selectedProduct = this.router.getCurrentNavigation().extras?.state?.selectedProduct;
    this.webPageCrawler.closeInAppBrowser();
    this.form = this.formBuilder.group({
      wishListId: this.formBuilder.control(null, {
        validators: [Validators.required]
      })
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search_by_url-wish-list');
  }

  async save() {
    const formData = this.urlSearchDataStore.formData;
    const wish: WishDto = {
      name: formData.name,
      price: formData.price,
      imageUrl: formData.imageUrl,
      productUrl: this.urlSearchDataStore.searchResultItem.productUrl,
      wishListId: this.form.controls.wishListId.value,
      isFavorite: false
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const createdWish = await this.wishService.createWish(wish).pipe(
        first(),
        tap(wish => {
          this.logAddToWishListEvent(wish);
          this.urlSearchDataStore.reset();
        }),
        finalize(() => {
          this.loadingService.stopLoadingSpinner();
        })
      ).toPromise();
      await this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich erstellt.');
      this.navigateToWishListDetailPage(createdWish.wishListId);
    } catch (error) {
      this.toastService.presentErrorToast('Bei der Erstellung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
    }
  }

  private logAddToWishListEvent(wish: WishDto) {
    this.analyticsService.logAppsflyerEvent('af_add_to_wishlist', {
      af_price: wish.price.amount,
      af_content_id: wish.asin,
      af_currency: wish.price.currency
    });
    this.analyticsService.logFirebaseEvent('add_to_wishlist', {
      content_id: wish.asin,
      value: wish.price.amount,
      currency: wish.price.currency,
    });
  }

  private navigateToWishListDetailPage(wishListId: string) {
    const wishSearchTabPath = getTaBarPath(TabBarRoute.WISH_SEARCH, true);
    const url = `/secure/home/wish-list/${wishListId}?forceRefresh=true`;
    if (this.router.url.includes(wishSearchTabPath)) {
      this.router.navigateByUrl(wishSearchTabPath).then(() => {
        this.router.navigateByUrl(url);
      });
    } else {
      this.router.navigateByUrl(url);
    }
  }

}
