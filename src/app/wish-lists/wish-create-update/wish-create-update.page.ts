import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListDto, WishDto, PriceDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { AlertService } from '@core/services/alert.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { NavigationService } from '@core/services/navigation.service';
import { concatMap, finalize, first, map } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-wish-create-update',
  templateUrl: './wish-create-update.page.html',
  styleUrls: ['./wish-create-update.page.scss'],
})
export class WishCreateUpdatePage implements OnInit {

  wish: WishDto = new WishDto();
  wishList: WishListDto = new WishListDto();
  wishListIdChanged = false;

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

  get title(): string {
    return this.isUpdatePage ? 'Wunsch bearbeiten' : 'Wunsch hinzufügen';
  }

  get screenName(): string {
    return this.isUpdatePage ? 'wish_settings' : 'wish_add';
  }

  get isUpdatePage(): boolean {
    return (this.wish && this.wish.id) ? true : false;
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
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private wishListStore: WishListStoreService,
    private searchResultDataService: SearchResultDataService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private analyticsService: AnalyticsService,
    private navigationService: NavigationService
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
    let wishListId = null;
    if (this.isUpdatePage) {
      wishListId = this.wish.wishListId;
    } else if (this.wishList) {
      wishListId = this.wishList.id;
    }
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
    this.analyticsService.setFirebaseScreenName(this.screenName);
  }

  async createOrUpdateWish() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.wish.price = PriceDto.fromAmount(this.form?.controls.price.value);

    if (this.isUpdatePage) {
      this.updateWish();
    } else {
      this.wish.wishListId = this.form?.controls.wishListId.value;
      this.createWish();
    }
  }

  private async updateWish(): Promise<void> {
    let observable = this.wishListStore.updateWish(this.wish);
    const currentWishListId = this.wish.wishListId;
    const selectedWishListId = this.form?.controls.wishListId.value;

    if (currentWishListId !== selectedWishListId) {
      const wishCopy = {...this.wish};
      wishCopy.wishListId = selectedWishListId;
      observable = this.wishListStore.updateWish(wishCopy).pipe(
        concatMap(updatedWish => {
          return from(this.wishListStore.updateWishListForWish(updatedWish, currentWishListId)).pipe(
            map(_ => { return updatedWish; })
          );
        })
      )
    }

    await this.loadingService.showLoadingSpinner();
    observable.pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: updatedWish => {
        this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich aktualisiert.');
        const url = `/secure/home/wish-list/${updatedWish.wishListId}`;
        this.navigationService.back(url);
      },
      error: _ => {
        const message = 'Bei der Aktualisierung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        this.toastService.presentErrorToast(message);
      }
    })
  }

  private async createWish(){
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

  async deleteWish(): Promise<void> {
    const header = 'Wunsch löschen';
    const message = `Möchtest du deinen Wunsch ${this.wish.name} wirklich löschen?`;
    const callbackHandler = () => { this.onDeleteConfirmation() };
    const alert = await this.alertService.createDeleteAlert(header, message, callbackHandler);
    alert.present();
  }

  private async onDeleteConfirmation(): Promise<void> {
    await this.loadingService.showLoadingSpinner();
    this.wishListStore.removeWish(this.wish).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: async _ => {
        await this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich gelöscht.');
        await this.router.navigate([`secure/home/wish-list/${this.wish.wishListId}`]);
      },
      error: _ => {
        this.toastService.presentErrorToast('Beim Löschen deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
      }
    })
  }

  private formatAmount(amount: number): string {
    return (Math.round(amount * 100) / 100).toFixed(2);
  }

}
