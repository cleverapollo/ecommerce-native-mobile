import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { WishListDto } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
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

  get validationMessages(): ValidationMessages {
    return {
      keywords: [
        new ValidationMessage('required', 'Bitte gib einen Suchbegriff ein.'),
        new ValidationMessage('minlength', 'Bitte gib min. 2 Zeichen an.')
      ]
    }
  };

  get keywords(): string {
    return this.form?.controls.keywords.value ?? null;
  }

  private wishList: WishListDto | null = null;

  constructor(
    private productSearchService: ProductSearchService,
    private formBuilder: FormBuilder,
    private router: Router,
    public platformService: DefaultPlatformService,
    private loadingService: LoadingService,
    private userProfileStore: UserProfileStore,
    private modalController: ModalController,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.wishList = this.router.getCurrentNavigation()?.extras?.state?.wishList;
    this.setupForm();
  }

  async ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wish_add');
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    const deviceInfo = await Device.getInfo();
    if (deviceInfo.platform === 'ios' && userProfile?.userSettings.showOnboardingSlidesiOS) {
      this.openOnboardingSlidesModal();
    } else if (deviceInfo.platform === 'android' && userProfile?.userSettings.showOnboardingSlidesAndroid) {
      this.openOnboardingSlidesModal();
    }
  }

  private async openOnboardingSlidesModal() {
    const modal = await this.modalController.create({
      component: ShareExtensionExplanationComponent,
      cssClass: 'wantic-modal wantic-modal-large',
      backdropDismiss: false
    });
    modal.present();
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

  private setupForm() {
    this.form = this.formBuilder.group({
      keywords: [null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }]
    });
  }

}
