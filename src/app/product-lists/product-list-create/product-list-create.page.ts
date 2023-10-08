import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { ProductListStoreService } from '@core/services/product-list-store.service';
import { CoreToastService } from '@core/services/toast.service';
import { NavController } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-list-create',
  templateUrl: './product-list-create.page.html',
  styleUrls: ['./product-list-create.page.scss'],
})
export class ProductListCreatePage implements OnInit {

  form: UntypedFormGroup;

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Vergib bitte einen Namen für deine Liste.')
      ]
    }
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private analyticsService: AnalyticsService,
    private navController: NavController,
    private loadingService: LoadingService,
    private productListStore: ProductListStoreService,
    private toastService: CoreToastService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    });
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('productlist_add');
  }

  goBack() {
    this.navController.back();
  }

  async create() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    await this.loadingService.showLoadingSpinner();
    this.productListStore.create(this.form.value).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: createdList => {
        this.toastService.presentSuccessToast('Deine Liste wurde erfolgreich erstellt.')
          .then(() => this.router.navigateByUrl(`/secure/product-lists/product-list/${createdList.id}`));
      },
      error: _ => {
        this.toastService.presentErrorToast('Bei der Erstellung deiner Liste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

}
