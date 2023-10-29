import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PriceDto, WishDto, WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { SearchResultDataService } from '@core/services/search-result-data.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { CustomValidation } from '@shared/custom-validation';
import { toDecimal } from '@shared/helpers/math.helper';
import { finalize, first } from 'rxjs/operators';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-wish-create',
  templateUrl: './wish-create.page.html',
  styleUrls: ['./wish-create.page.scss'],
})
export class WishCreatePage implements OnInit {

  wish = new WishDto();
  wishList = new WishListDto();
  form: UntypedFormGroup | undefined;

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
    private location: Location,
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this._setupViewData();
    this._setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wish_add');
  }

  async create() {
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
        this.analyticsService.logAddToWishListEvent(createdWish);
        this.toastService.presentSuccessToast('Dein Wunsch wurde erfolgreich erstellt.');
        this._handleNavigation(this.wish.wishListId);
      },
      error: _ => {
        const message = 'Bei der Erstellung deines Wunsches ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
        this.toastService.presentErrorToast(message);
      }
    })
  }

  private async _handleNavigation(wishListId: string): Promise<boolean> {
    const wishSearchTabPath = getTaBarPath(TabBarRoute.WISH_SEARCH, true);
    const url = `/secure/home/wish-list/${wishListId}?forceRefresh=true`;
    if (this.router.url.includes(wishSearchTabPath)) {
      return this.router.navigateByUrl(wishSearchTabPath);
    } else if (this.router.url.includes(getTaBarPath(TabBarRoute.CREATOR_SEARCH, true))) {
      this.location.back();
      return true;
    }
    return this.router.navigateByUrl(url);
  }

  private _setupViewData() {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    this.wish = state?.wish ? state.wish : state?.searchResult;
    this.wishList = state?.wishList;
  }

  private _setupForm() {
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
      price: this.formBuilder.control(toDecimal(price), {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      isFavorite: this.formBuilder.control(this.wish?.isFavorite ?? false)
    });
  }
}
