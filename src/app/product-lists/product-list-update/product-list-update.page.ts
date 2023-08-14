import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductList } from '@core/models/product-list.model';
import { AlertService } from '@core/services/alert.service';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { Subscription } from 'rxjs';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-update',
  templateUrl: './product-list-update.page.html',
  styleUrls: ['./product-list-update.page.scss'],
})
export class ProductListUpdatePage implements OnInit, OnDestroy {

  form: FormGroup;
  productList: ProductList;

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Vergib bitte einen Namen für deine Liste.')
      ]
    }
  };

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private productListStore: ProductListStoreService,
    private toastService: CoreToastService
  ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      const id = params['productListId'];
      if (id) {
        this._init(id);
      }
    });

    this.form = this.formBuilder.group({
      name: this.formBuilder.control('Lädt ...', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
  }

  private async _init(id: string) {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.getById(id, false).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: productList => {
        this.productList = productList;
        this.form.controls.name.setValue(productList.name);
      }
    })
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('productlist_settings');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async update() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }

    await this.loadingService.showLoadingSpinner();
    this.productListStore.update({
      ...this.productList, ...this.form.value
    }).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: wishList => {
        this.productList = wishList;
        this.toastService.presentSuccessToast('Deine Liste wurde erfolgreich aktualisiert.');
      },
      error: _ => {
        this.toastService.presentErrorToast('Bei der Aktualisierung deiner Liste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

  async delete() {
    const header = 'Liste löschen';
    const message = `Möchtest du deine Liste ${this.productList.name} wirklich löschen?`;
    const alert = await this.alertService.createDeleteAlert(header, message, this._onDeleteConfirmation);
    alert.present();
  }

  private _onDeleteConfirmation = async () => {
    await this.loadingService.showLoadingSpinner();
    this.productListStore.deleteById(this.productList.id).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: async _ => {
        await this.toastService.presentSuccessToast('Deine Liste wurde erfolgreich gelöscht');
        this.router.navigateByUrl('/secure/product-lists/product-list-overview');
      },
      error: _ => {
        this.toastService.presentErrorToast('Beim Löschen deiner Liste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

}
