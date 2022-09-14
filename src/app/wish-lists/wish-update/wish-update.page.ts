import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceDto, WishDto, WishListDto } from '@core/models/wish-list.model';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { CustomValidation } from '@shared/custom-validation';
import { from, Subscription } from 'rxjs';
import { concatMap, finalize, first, map } from 'rxjs/operators';

@Component({
  selector: 'app-wish-update',
  templateUrl: './wish-update.page.html',
  styleUrls: ['./wish-update.page.scss'],
})
export class WishUpdatePage implements OnInit, OnDestroy {

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

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private wishListStore: WishListStoreService,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private analyticsService: AnalyticsService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.setupViewData();
    this.setupForm();
    this.listenForChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private setupViewData() {
    this.wish = this.route.snapshot.data.wish ?
      this.route.snapshot.data.wish :
      this.router.getCurrentNavigation()?.extras?.state?.searchResult;
    this.wishList = this.route.snapshot.data.wishList;
  }

  private listenForChanges() {
    this.subscription = this.wishListStore.wishLists.subscribe(wishLists => {
      const wish = this.findWish(wishLists);
      if (wish) {
        this.wish = wish;
      }
    });
  }

  private findWish(wishLists: WishListDto[]): WishDto | undefined {
    const wishList = this.findWishList(wishLists);
    if (wishList) {
      return wishList.wishes.find(w => w.id === this.wish.id);
    }
  }

  private findWishList(wishLists: WishListDto[]): WishListDto | undefined {
    return wishLists.find(w => w.id === this.wishList.id);
  }

  private setupForm() {
    const wishListId = this.wish?.wishListId;
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
    this.analyticsService.setFirebaseScreenName('wish_settings');
  }

  async update(): Promise<void> {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    this.wish.price = PriceDto.fromAmount(this.form?.controls.price.value);

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
        this.toastService.presentSuccessToast('Wunsch aktualisiert.');
        const url = `/secure/home/wish-list/${updatedWish.wishListId}`;
        this.navigationService.back(url);
      },
      error: _ => {
        this.toastService.presentErrorToast('Fehler beim Aktualisieren');
      }
    })
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
