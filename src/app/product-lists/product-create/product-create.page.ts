import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductList } from '@core/models/product-list.model';
import { PriceDto } from '@core/models/wish-list.model';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { NavigationService } from '@core/services/navigation.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { WishImageComponentStyles } from '@shared/components/wish-image/wish-image.component';
import { CustomValidation } from '@shared/custom-validation';
import { toDecimal } from '@shared/helpers/math.helper';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.page.html',
  styleUrls: ['./product-create.page.scss'],
})
export class ProductCreatePage implements OnInit {

  form: FormGroup;
  product: Product;
  productList: ProductList;

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
        'padding-bottom': '20px'
      }
    };
  }

  get priceAmount(): number {
    return this.form?.controls.price.value;
  }

  ngOnInit() {
    this.product = this.route.snapshot.data.product || this.router.getCurrentNavigation()?.extras?.state?.searchResult;
    this.productList = this.route.snapshot.data.productList;
    this._setupForm();
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
      await this.productListStore.createProduct({
        ...this.form.value,
        price: PriceDto.fromAmount(this.priceAmount)
      });
      await this.loadingService.stopLoadingSpinner();
      await this.toastService.presentSuccessToast('Produkt erfolgreich gespichert');
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
      this.toastService.presentErrorToast('Fehler beim Speichern');
    }
  }

  private _setupForm() {
    this.form = this.fb.group({
      productListId: [this.productList?.id, { validators: [Validators.required], updateOn: 'change' }],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      note: [null, [Validators.maxLength(255)]],
      price: [toDecimal(0.00), [Validators.required]],
      coupon: this.fb.group({
        code: [null],
        value: [null],
        expirationDate: [null]
      }),
      productUrl: [null, [Validators.required]],
      affiliateUrl: [null]
    },
      { updateOn: 'blur' }
    );
  }

}
