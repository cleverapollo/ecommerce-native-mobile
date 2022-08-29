import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { Logger } from '@core/services/log.service';
import { DefaultPlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';
import { ModalController } from '@ionic/angular';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { first } from 'rxjs/operators';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { ShareExtensionExplanationComponent } from '../../share-extension-explanation/share-extension-explanation.component';

@Component({
  selector: 'app-wish-search-overview',
  templateUrl: './wish-search-overview.page.html',
  styleUrls: ['./wish-search-overview.page.scss'],
})
export class WishSearchOverviewPage implements OnInit {

  get validationMessages(): ValidationMessages {
    return {
      keywords: [
        new ValidationMessage('required', 'Bitte gib einen Suchbegriff ein.'),
        new ValidationMessage('minlength', 'Bitte gib min. 2 Zeichen an.')
      ],
      url: [
        new ValidationMessage('required', 'Bitte gib zunächst eine URL ein.'),
        new ValidationMessage('pattern', 'Die eingegebene URL ist ungültig. Bitte überprüfe deine Eingabe.')
      ]
    }
  };

  get keywords(): string {
    return this.searchByAmazonApiForm?.controls.keywords.value ?? null;
  }

  get url(): string {
    return this.searchByURLForm?.controls.url.value ?? null;
  }

  get showUrlSearch(): boolean {
    return environment.backendType !== BackendConfigType.prod;
  }

  searchByAmazonApiForm: FormGroup;
  searchByURLForm: FormGroup;

  constructor(
    private productSearchService: ProductSearchService,
    private formBuilder: FormBuilder,
    private router: Router,
    private logger: Logger,
    public platformService: DefaultPlatformService,
    private loadingService: LoadingService,
    private userProfileStore: UserProfileStore,
    private modalController: ModalController,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.searchByAmazonApiForm = this.formBuilder.group({
      keywords: [null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
       }]
    });
    this.searchByURLForm = this.formBuilder.group({
      url: [null, {
        validators: [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
        updateOn: 'submit'
       }]
    });
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
    if (this.searchByAmazonApiForm.invalid) {
      return;
    }

    const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-amazon`;
    try {
      await this.loadingService.showLoadingSpinner();
      await this.productSearchService.searchByAmazonApi(this.keywords, 1);
      await this.loadingService.stopLoadingSpinner();
      await this.router.navigateByUrl(targetUrl);
      this.searchByAmazonApiForm.reset();
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
    }
  }

  searchByURL() {
    const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-url/select-image`
    this.productSearchService.searchByUrl(this.url).pipe(first()).subscribe(searchResults => {
      this.router.navigateByUrl(targetUrl).then(() => {
        this.searchByURLForm.reset();
      });
    }, this.logger.error)
  }

}
