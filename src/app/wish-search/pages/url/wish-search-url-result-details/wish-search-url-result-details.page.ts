import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchResult, SearchResultItem } from '@core/models/search-result-item';
import { AnalyticsService } from '@core/services/analytics.service';
import { IonInput } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { Plugins } from '@capacitor/core';
import { UrlSearchDataStoreService } from '../url-search-data-store.service';
import { PriceDto } from '@core/models/wish-list.model';
import { getTaBarPath, TabBarRoute } from 'src/app/tab-bar/tab-bar-routes';
const { Keyboard } = Plugins;

@Component({
  selector: 'app-wish-search-url-result-details',
  templateUrl: './wish-search-url-result-details.page.html',
  styleUrls: ['./wish-search-url-result-details.page.scss'],
})
export class WishSearchUrlResultDetailsPage implements OnInit {

  @ViewChild(IonInput) priceInput: IonInput;

  selectedProduct: SearchResultItem;

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Bitte gib eine Bezeichnung für deinen Wunsch an.')
      ],
      price: [
        new ValidationMessage('required', 'Bitte gib einen Preis für deinen Wunsch an.')
      ]
    }
  }

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder,
    private analyticsService: AnalyticsService,
    private urlSearchDataStore: UrlSearchDataStoreService
  ) { }

  ngOnInit() {
    this.selectedProduct = this.router.getCurrentNavigation().extras.state?.selectedProduct;
    this.initForm();
  }

  private initForm() {
    const name = this.selectedProduct?.name || '';
    const price = this.selectedProduct?.price?.amount || 0.00;
    const formattedPrice = this.formatAmount(price);
    this.form = this.formBuilder.group({
      'name': this.formBuilder.control(name, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      'price': this.formBuilder.control(formattedPrice, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
    });
  }

  private formatAmount(amount: number) {
    return (Math.round(amount * 100) / 100).toFixed(2);
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('search_by_url-name-price');
  }

  next() {
    this.updateFormData();
    const targetUrl = `${getTaBarPath(TabBarRoute.WISH_SEARCH, true)}/search-by-url/select-wish-list`
    this.router.navigateByUrl(targetUrl, {
      state: {
        selectedProduct: this.selectedProduct
      }
    });
  }

  private updateFormData() {
    this.urlSearchDataStore.formData.name = this.form.controls.name.value;
    this.urlSearchDataStore.formData.price = this.createPrice(this.form.controls.price.value);
  }

  private createPrice(amount: number) {
    let price = new PriceDto();
    price.amount = amount;
    price.currency = '€'
    return price;
  }

  setFocusToPriceInputFieldOnEnter(keyCode: number) {
    if (keyCode == 13) { 
      this.priceInput.setFocus();
    }    
  }

  hideKeyboardOnEnter(keyCode: number) {
    if (keyCode == 13) { 
      Keyboard.hide();
    }
  }

}
