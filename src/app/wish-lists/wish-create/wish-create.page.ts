import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceDto, WishDto, WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-wish-create',
  templateUrl: './wish-create.page.html',
  styleUrls: ['./wish-create.page.scss'],
})
export class WishCreatePage implements OnInit {

  wish = new WishDto();
  wishList = new WishListDto();
  form: FormGroup | undefined;

  get validationMessages(): ValidationMessages {
    return {
      wishListId: [
        new ValidationMessage('required', 'Dein Wunsch muss einer Wunschliste zugeordnet sein.')
      ],
      name: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte eine Bezeichnung.'),
        new ValidationMessage('maxlength', 'Der Name ist zu lang.')
      ],
      note: [
        new ValidationMessage('maxlength', 'Deine Notiz ist zu lang.')
      ],
      price: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte einen Preis.')
      ]
    }
  }

  get wishImagesStyles(): WishImageComponentStyles {
    return {
      img: {
        'padding-top': '20px',
        'padding-bottom': '20px'
      }
    };
  }

  constructor(
    private loadingService: LoadingService,
    private wishListStore: WishListStoreService,
    private toastService: CoreToastService,
    private searchResultDataService: SearchResultDataService,
    private analyticsService: AnalyticsService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setupViewData();
    this.setupForm();
  }

  private setupViewData() {
    this.wish = this.route.snapshot.data.wish ?
      this.route.snapshot.data.wish :
      this.router.getCurrentNavigation()?.extras?.state?.searchResult;
    this.wishList = this.route.snapshot.data.wishList;
  }

  private setupForm() {
    const wishListId = this.wishList?.id;
    const name = this.wish?.name ? this.wish.name : '';
    const price = this.wish?.price.amount ? this.wish.price.amount : 0.00;

    this.form = this.formBuilder.group({
      wishListId: this.formBuilder.control(wishListId, {
        validators: [Validators.required]
      }),
      name: this.formBuilder.control(name, {
        validators: [Validators.required, Validators.maxLength(255)],
        updateOn: 'blur'
      }),
      note: this.formBuilder.control(this.wish?.note, {
        validators: [Validators.maxLength(255)],
        updateOn: 'blur'
      }),
      price: this.formBuilder.control(this.formatAmount(price), {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      isFavorite: this.formBuilder.control(this.wish?.isFavorite ?? false)
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wish_add');
  }

  async create(){
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.wish.price = PriceDto.fromAmount(this.form?.controls.price.value);
    this.wish.wishListId = this.form?.controls.wishListId.value;

    await this.loadingService.showLoadingSpinner();
    this.wishListStore.createWish(this.wish).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: createdWish => {
        this.searchResultDataService.clear();
        this.logAddToWishListEvent(createdWish);
        this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich erstellt.');
        this.navigateToWishListDetailPage(this.wish.wishListId);
      },
      error: _ => {
        const message = 'Bei der Erstellung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
        this.toastService.presentErrorToast(message);
      }
    })
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

  private async navigateToWishListDetailPage(wishListId: string): Promise<boolean> {
    const wishSearchTabPath = getTaBarPath(TabBarRoute.WISH_SEARCH, true);
    const url = `/secure/home/wish-list/${wishListId}?forceRefresh=true`;
    if (this.router.url.includes(wishSearchTabPath)) {
      return this.router.navigateByUrl(wishSearchTabPath);
    }
    return this.router.navigateByUrl(url);
  }

  private formatAmount(amount: number): string {
    return (Math.round(amount * 100) / 100).toFixed(2);
  }
}