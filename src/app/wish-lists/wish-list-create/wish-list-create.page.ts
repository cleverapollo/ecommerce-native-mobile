import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishListCreateRequest } from '@core/models/wish-list.model';
import { AnalyticsService } from '@core/services/analytics.service';
import { LoadingService } from '@core/services/loading.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { NavController } from '@ionic/angular';
import { ValidationMessage, ValidationMessages } from '@shared/components/validation-messages/validation-message';
import { CustomValidation } from '@shared/custom-validation';
import { addYears } from 'date-fns';
import { finalize, first } from 'rxjs/operators';

@Component({
  selector: 'app-wish-list-create',
  templateUrl: './wish-list-create.page.html',
  styleUrls: ['./wish-list-create.page.scss'],
})
export class WishListCreatePage implements OnInit {

  form: UntypedFormGroup | undefined;
  /** ISO Date string */
  minDate = new Date().toISOString();
  /** ISO Date string */
  get maxDate(): string {
    const min = new Date(this.minDate);
    const max = addYears(min, 10);
    return max.toISOString();
  }

  get validationMessages(): ValidationMessages {
    return {
      name: [
        new ValidationMessage('required', 'Vergib bitte einen Namen für deine Wunschliste.')
      ],
      partnerEmail: [
        new ValidationMessage('email', 'Bitte gib eine gültige E-Mail Adresse ein.')
      ],
    }
  };

  get classForToggleLabel(): string {
    const showReservedWishes = this.form?.get('showReservedWishes')?.value ?? false;
    return showReservedWishes ? 'toggle-checked' : 'toggle-unchecked';
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private navController: NavController,
    private toastService: CoreToastService,
    private wishListStore: WishListStoreService,
    private router: Router,
    private loadingService: LoadingService,
    private analyticsService: AnalyticsService,
  ) { }

  ngOnInit() {
    this.setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist_add');
  }

  goBack() {
    this.navController.back();
  }

  async create() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    const request: WishListCreateRequest = {
      name:  this.form?.controls.name.value,
      showReservedWishes: this.form?.controls.showReservedWishes.value,
      date: this.form?.controls.date.value
    };
    await this.loadingService.showLoadingSpinner();
    this.wishListStore.createWishList(request).pipe(
      first(),
      finalize(async () => {
        await this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: async createdWishList => {
        await this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich erstellt.');

        this.router.navigateByUrl(`/secure/home/wish-list/${createdWishList.id}`);
      },
      error: _ => {
        this.toastService.presentErrorToast('Bei der Erstellung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

  private setupForm() {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      date: this.formBuilder.control(''),
      showReservedWishes: this.formBuilder.control(false)
    });
  }
}
