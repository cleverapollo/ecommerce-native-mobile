import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { PlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';
import { ShareExtensionExplanationComponent } from '../share-extension-explanation/share-extension-explanation.component';

@Component({
  selector: 'app-wish-search-overview',
  templateUrl: './wish-search-overview.page.html',
  styleUrls: ['./wish-search-overview.page.scss'],
})
export class WishSearchOverviewPage implements OnInit {

  form: FormGroup;
  urlForm: FormGroup;

  get validationMessages(): ValidationMessages {
    return {
      keywords: [
        new ValidationMessage('required', 'Bitte gib einen Suchbegriff ein.'),
        new ValidationMessage('minlength', 'Bitte gib min. 2 Zeichen an.')
      ],
      url: [
        new ValidationMessage('required', 'Bitte gib eine URL ein.'),
        new ValidationMessage('pattern', 'Bitte gib eine gültige URL an.')
      ]
    }
  };

  get keywords(): string | null {
    return this.form?.controls.keywords.value ?? null;
  }

  get url(): string | null {
    return this.urlForm?.controls.url.value ?? null;
  }

  get isIOS(): boolean {
    return this.platformService.isIOS;
  }

  get isAndroid(): boolean {
    return this.platformService.isAndroid;
  }

  private wishList: WishListDto | null = null;

  constructor(
    private readonly productSearchService: ProductSearchService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly loadingService: LoadingService,
    private readonly userProfileStore: UserProfileStore,
    private readonly modalController: ModalController,
    private readonly analyticsService: AnalyticsService,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this.wishList = this.router.getCurrentNavigation()?.extras?.state?.wishList;
    this._setupForms();
  }

  async ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search');

    if (await this._showOnboardingSlides()) {
      this._openOnboardingSlidesModal();
    }
  }

  async searchByAmazonApi() {
    if (this.form.invalid) {
      return;
    }

    await this.loadingService.showLoadingSpinner();
    this.productSearchService.searchByAmazonApi(this.keywords, 1).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: _ => {
        const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-amazon`;
        this.form.reset();
        this.router.navigateByUrl(targetUrl, {
          state: {
            wishList: this.wishList
          }
        });
      }
    })
  }

  async searchByUrl() {
    if (this.urlForm.invalid) {
      return;
    }

    await this.loadingService.showLoadingSpinner();
    this.productSearchService.searchByUrl(this.url).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: _ => {
        const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-url`;
        this.urlForm.reset();
        this.router.navigateByUrl(targetUrl);
      }
    })
  }

  private _setupForms() {
    this.form = this.formBuilder.group({
      keywords: [null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }]
    });
    this.urlForm = this.formBuilder.group({
      url: [null, {
        validators: [Validators.required, Validators.pattern(CustomValidation.urlRegex)],
        updateOn: 'submit'
      }]
    });
  }

  private async _showOnboardingSlides(): Promise<boolean> {
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    const userSettings = userProfile?.userSettings;
    return userSettings?.showOnboardingSlidesAndroid && this.isAndroid ||
      userSettings?.showOnboardingSlidesiOS && this.isIOS
  }

  private async _openOnboardingSlidesModal() {
    const modal = await this.modalController.create({
      component: ShareExtensionExplanationComponent,
      cssClass: 'wantic-modal wantic-modal-large',
      backdropDismiss: false
    });
    modal.present();
  }

}
