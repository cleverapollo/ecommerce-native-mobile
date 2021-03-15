import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductSearchService } from '@core/services/product-search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '@core/services/log.service';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingService } from '@core/services/loading.service';
import { UserService } from '@core/services/user.service';
import { OnboardingSlidesComponent } from './onboarding-slides/onboarding-slides.component';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';

@Component({
  selector: 'app-wish-search-selection',
  templateUrl: './wish-search-selection.page.html',
  styleUrls: ['./wish-search-selection.page.scss'],
})
export class WishSearchSelectionPage implements OnInit {
  
  get validationMessages(): ValidationMessages {
    return {
      keywords: [
        new ValidationMessage('required', 'Bitte gib einen Suchbegriff ein.'),
        new ValidationMessage('minlength', 'Bitte gib min. 2 Zeichen an.')
      ]
    }
  };

  get keywords(): string {
    return this.searchByAmazonApiForm?.controls.keywords.value ?? null;
  }

  searchByAmazonApiForm: FormGroup;
  
  constructor(
    private productSearchService: ProductSearchService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LogService,
    public platform: Platform,
    private loadingService: LoadingService,
    private userService: UserService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.searchByAmazonApiForm = this.formBuilder.group({
      keywords: [null, { 
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
       }]
    });
  }

  ionViewDidEnter() {
    this.userService.showOnboardingSlides().then(show => {
      if (show) {
        this.openOnboardingSlidesModal();
      }
    });
  }

  private async openOnboardingSlidesModal() {
    const modal = await this.modalController.create({
      component: OnboardingSlidesComponent,
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
      this.navigateToSearchResultPage();
    }, this.logger.error).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

  private navigateToSearchResultPage() {
    this.router.navigate(['wish-search-results'], { relativeTo: this.route });
  }

}
