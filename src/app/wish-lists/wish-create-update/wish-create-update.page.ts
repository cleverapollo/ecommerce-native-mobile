import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListDto, WishDto, PriceDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { WishApiService } from '@core/api/wish-api.service';
import { AlertService } from '@core/services/alert.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { LoadingService } from '@core/services/loading.service';
import { ToastService } from '@core/services/toast.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-wish-create-update',
  templateUrl: './wish-create-update.page.html',
  styleUrls: ['./wish-create-update.page.scss'],
})
export class WishCreateUpdatePage implements OnInit, OnDestroy {

  wish: WishDto
  wishList: WishListDto

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      wishListId: [
        new ValidationMessage('required', 'Weise deinem Wunsch bitte eine Wunschliste zu.')
      ],
      name: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte eine Bezeichnung.')
      ],
      price: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte einen Preis.')
      ]
    }
  }

  get title(): string {
    return  this.isUpdatePage ? 'Wunsch bearbeiten' : 'Wunsch hinzufügen';
  }

  get screenName(): string {
    return this.isUpdatePage ? 'wish_settings' : 'wish_add';
  }

  get isUpdatePage(): boolean {
    return (this.wish && this.wish.id) ? true : false;
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private wishListApiService: WishListApiService,
    private wishApiService: WishApiService,
    private alertService: AlertService,
    private wishListStore: WishListStoreService,
    private searchResultDataService: SearchResultDataService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private analyticsService: AnalyticsService
    ) { }

  ngOnInit() {
    this.analyticsService.setFirebaseScreenName(this.screenName);
    this.initViewData();
    this.createForm();
  }

  private initViewData() {
    this.wish = this.route.snapshot.data.wish ? this.route.snapshot.data.wish : this.router.getCurrentNavigation().extras.state.searchResult;
    this.wishList = this.route.snapshot.data.wishList;
  }

  private createForm() {
    let wishListId = null;
    if (this.isUpdatePage) {
      wishListId = this.wish.wishListId;
    } else if (this.wishList) {
      wishListId = this.wishList.id;
    }
    const name = this.wish.name ? this.wish.name : '';
    const price = this.wish.price.amount ? this.wish.price.amount : 0.00;
    const formattedPrice = this.formatAmount(price);
    this.form = this.formBuilder.group({
      'wishListId': this.formBuilder.control(wishListId, {
        validators: [Validators.required]
      }),
      'name': this.formBuilder.control(name, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      'price': this.formBuilder.control(formattedPrice, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
    });
  }

  ngOnDestroy(): void {}

  createOrUpdateWish() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    if (this.isUpdatePage) {
      this.updateWish();
    } else {
      this.createWish();
    }
  }

  deleteWish() {
    const header = 'Wunsch löschen';
    const message = `Möchtest du deinen Wunsch ${this.wish.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    })
  }

  private onDeleteConfirmation = () => {
    this.loadingService.showLoadingSpinner();
    this.wishListApiService.removeWish(this.wish).toPromise().then(() => {
      this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich gelöscht.');
      this.wishListStore.removeWishFromCache(this.wish).then(() => {
        this.router.navigate([`secure/home/wish-list/${this.wish.wishListId}`]);
      });
    }, error => {
      this.toastService.presentErrorToast('Beim Löschen deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });;
  }

  private createWish() {
    const wishListId = this.form.controls.wishListId.value;
    this.wish.wishListId = wishListId;
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.createPrice(this.form.controls.price.value);
    this.loadingService.showLoadingSpinner();
    this.wishApiService.createWish(this.wish).toPromise().then(createdWish => {
      this.searchResultDataService.clear();
      this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich erstellt.');
      this.wishListStore.saveWishToCache(createdWish).then(() => {
        this.navigateToWishListDetailPage(wishListId);
      });
    }, error => {
      this.toastService.presentErrorToast('Bei der Erstellung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

  private formatAmount(amount: number) {
    return (Math.round(amount * 100) / 100).toFixed(2);
  }

  private createPrice(amount: number) {
    let price = new PriceDto();
    price.amount = amount;
    price.currency = '€'
    return price;
  }
  
  private navigateToWishListDetailPage(wishListId: number) {
    const wishSearchTabPath = getTaBarPath(TabBarRoute.WISH_SEARCH, true);
    const url = `/secure/home/wish-list/${wishListId}`;
    if (this.router.url.includes(wishSearchTabPath)) {
      this.router.navigateByUrl(wishSearchTabPath).then(() => {
        this.router.navigateByUrl(url);
      });
    } else {
      this.router.navigateByUrl(url);
    }
  }

  private updateWish() {
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.createPrice(this.form.controls.price.value);
    this.loadingService.showLoadingSpinner();
    this.wishApiService.update(this.wish).toPromise().then(updatedWish => { 
        this.wishListStore.updateCachedWish(updatedWish);
        this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich aktualisiert.')
    }, error => {
      this.toastService.presentErrorToast('Bei der Aktualisierung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.')
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

}
