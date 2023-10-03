import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@core/models/product-list.model';
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
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { TabBarRoute, getTaBarPath } from 'src/app/tab-bar/tab-bar-routes';

const productListPageUrl = (productListId: string) => `/${getTaBarPath(TabBarRoute.PRODUCT_LISTS, true)}/product-list/${productListId}`;

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.page.html',
  styleUrls: ['./product-update.page.scss'],
})
export class ProductUpdatePage implements OnInit {

  product: Product;
  form: FormGroup;
  backNavPath = 'secure/product-lists/product-list-overview';

  private productListIdParam: string;
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
        'padding-bottom': '20px'
      }
    };
  }

  get priceAmount(): number {
    return this.form?.controls.price.value;
  }

  get productListId(): string {
    return this.form?.controls.productListId.value;
  }

  ngOnInit() {
    this.product = this.router.getCurrentNavigation()?.extras.state?.product;
    this.subscription.add(this.route.params.subscribe(params => {
      const productId = params['productId'];
      this.productListIdParam = params['productListId'];
      if (!this.product && productId) {
        this._loadProduct(productId);
      }
      if (this.productListIdParam) {
        this.backNavPath = productListPageUrl(this.productListIdParam);
      }
    }));
  }

  ionViewWillEnter() {
    if (this.product.id) {
      this._loadProduct(this.product.id);
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('product_settings');
  }

  async delete(): Promise<void> {
    const header = 'Wunsch löschen';
    const message = `Möchtest du das Produkt "${this.product.name}" wirklich löschen?`;
    const alert = await this.alertService.createDeleteAlert(header, message, async () => {
      try {
        await this.loadingService.showLoadingSpinner();
        await this.productListStore.deleteProduct(this.product.id);
        await this.loadingService.stopLoadingSpinner();
        await this.toastService.presentSuccessToast('Das Produkt wurde gelöscht');
        await this.router.navigate([productListPageUrl(this.productListIdParam)]);
      } catch (error) {
        await this.loadingService.stopLoadingSpinner();
        await this.toastService.presentErrorToast('Fehler beim Löschen des Produkts');
      }
    });
    alert.present();
  }

  async update(): Promise<void> {
    if (this.form?.invalid) {
      console.log(this.form.value);
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    try {
      await this.loadingService.showLoadingSpinner();
      const updatedProduct = await this.productListStore.updateProduct({
        ...this.form.value,
        id: this.product.id,
        price: PriceDto.fromAmount(this.priceAmount)
      }, this.product.productListId);
      await this.loadingService.stopLoadingSpinner();
      await this.toastService.presentSuccessToast('Produkt aktualisiert.');
      await this.navigationService.back(productListPageUrl(updatedProduct.productListId));
    } catch (error) {
      await this.loadingService.stopLoadingSpinner();
      this.toastService.presentErrorToast('Fehler beim Aktualisieren');
    }
  }

  private _setupForm() {
    this.form = this.fb.group({
      productListId: [this.product?.productListId, { validators: [Validators.required], updateOn: 'change' }],
      name: [this.product?.name, [Validators.required, Validators.maxLength(255)]],
      note: [this.product?.note, [Validators.maxLength(255)]],
      price: [toDecimal(this.product?.price.amount || 0.00), [Validators.required]],
      coupon: this.fb.group({
        code: [this.product.coupon?.code],
        value: [this.product.coupon?.value],
        expirationDate: [this.product.coupon?.expirationDate]
      }),
      productUrl: [this.product.productUrl, [Validators.required]],
      affiliateUrl: [this.product?.affiliateUrl]
    },
      { updateOn: 'blur' }
    );
  }

  private _loadProduct(id: string) {
    this.productListStore.getProduct(id).pipe(first()).subscribe(product => {
      this.product = product;
      this._setupForm();
    })
  }


}
