import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { PlatformService } from '@core/services/platform.service';
import { ProductSearchService } from '@core/services/product-search.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-search-overview',
  templateUrl: './product-search-overview.page.html',
  styleUrls: ['./product-search-overview.page.scss'],
})
export class ProductSearchOverviewPage implements OnInit {

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

  constructor(
    private readonly productSearchService: ProductSearchService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly loadingService: LoadingService,
    private readonly analyticsService: AnalyticsService,
    private readonly platformService: PlatformService
  ) { }

  ngOnInit() {
    this._setupForms();
  }

  async ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search');
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
        this.form.reset();
        this.router.navigate(['amazon'], { relativeTo: this.route });
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
        this.urlForm.reset();
        this.router.navigate(['url'], { relativeTo: this.route });
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

}
