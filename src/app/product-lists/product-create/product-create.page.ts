import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResultItem } from '@core/models/search-result-item';
import { PriceDto } from '@core/models/wish-list.model';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { productListPageUrl } from '@productLists/product-lists.helper';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { CustomValidation } from '@shared/custom-validation';
import { toDecimal } from '@shared/helpers/math.helper';
import { Subscription } from 'rxjs';
import { TabBarRoute, getTaBarPath, isTabActivated } from 'src/app/tab-bar/tab-bar-routes';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.page.html',
  styleUrls: ['./product-create.page.scss'],
})
export class ProductCreatePage implements OnInit {

  form: FormGroup;
  product: SearchResultItem;

  private productListId: string;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toastService: CoreToastService,
    private alertService: AlertService,
    private productListStore: ProductListStoreService,
    private navigationService: NavigationService,
    private analyticsService: AnalyticsService
  ) { }

  get validationMessages(): ValidationMessages {
    return {
      productListId: [
        new ValidationMessage('required', 'Liste erforderlich')
      ],
      name: [
        new ValidationMessage('required', 'Name erforderlich'),
        new ValidationMessage('maxlength', 'Der Name ist zu lang')
      ],
      note: [
        new ValidationMessage('maxlength', 'Deine Notiz ist zu lang')
      ],
      price: [
        new ValidationMessage('required', 'Preis erforderlich')
      ],
      productUrl: [
        new ValidationMessage('required', 'Produkt URL erforderlich')
      ]
    }
  }

  get imageStyles(): WishImageComponentStyles {
    return {
      img: {
        'padding-top': '20px',
        'padding-bottom': '20px',
        'max-width': '80%'
      }
    };
  }

  get priceAmount(): number {
    return this.form?.controls.price.value;
  }

  ngOnInit() {
    this.product = this.router.getCurrentNavigation()?.extras?.state?.searchResult;
    this.subscription.add(this.route.params.subscribe(params => {
      this.productListId = params['productListId'];
      if (!this.form) {
        this._setupForm();
      }
    }));
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('product_add');
  }

  async create() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const createdProduct = await this.productListStore.createProduct({
        ...this.form.value,
        imageUrl: this.product.imageUrl,
        price: PriceDto.fromAmount(this.priceAmount)
      });
      await this.loadingService.stopLoadingSpinner();
      await this.toastService.presentSuccessToast('Produkt erfolgreich gespichert');
      await this.navigationService.root(
        isTabActivated(this.router.url, TabBarRoute.PRODUCT_SEARCH) ?
          getTaBarPath(TabBarRoute.PRODUCT_SEARCH, true) :
          productListPageUrl(createdProduct.productListId || this.productListId)
      );
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
      this.toastService.presentErrorToast('Fehler beim Speichern');
    }
  }

  private _setupForm() {
    this.form = this.fb.group({
      productListId: [this.productListId, { validators: [Validators.required], updateOn: 'change' }],
      name: [this.product.name, [Validators.required, Validators.maxLength(255)]],
      note: [null, [Validators.maxLength(255)]],
      price: [toDecimal(this.product.price.amount || 0.00), [Validators.required]],
      coupon: this.fb.group({
        code: [null],
        value: [null],
        expirationDate: [null]
      }),
      productUrl: [this.product.productUrl, [Validators.required]],
      affiliateUrl: [null]
    },
      { updateOn: 'blur' }
    );
  }

}
