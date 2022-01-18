import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductSearchService } from '@core/services/product-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '@core/services/loading.service';
import { ShareExtensionExplanationComponent } from '../../share-extension-explanation/share-extension-explanation.component';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { AnalyticsService } from '@core/services/analytics.service';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { Device } from '@capacitor/device';
import { DefaultPlatformService } from '@core/services/platform.service';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
import { first } from 'rxjs/operators';
import { BackendConfigType } from '@env/backend-config-type';
import { environment } from '@env/environment';

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
    private route: ActivatedRoute,
    private logger: LogService,
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

  searchByAmazonApi() {
    if (this.searchByAmazonApiForm.invalid) {
      return;
    }
    this.loadingService.showLoadingSpinner();
    this.productSearchService.searchByAmazonApi(this.keywords, 1).then(searchResults => {
      const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-amazon`
      this.router.navigateByUrl(targetUrl).then(() => {
        this.searchByAmazonApiForm.reset();
      });
    }, this.logger.error).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
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
