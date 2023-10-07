import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WishListDto, WishListUpdateRequest } from '@core/models/wish-list.model';
import { AlertService } from '@core/services/alert.service';
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
  selector: 'app-wish-list-update',
  templateUrl: './wish-list-update.page.html',
  styleUrls: ['./wish-list-update.page.scss'],
})
export class WishListUpdatePage implements OnInit {

  form: FormGroup | undefined;
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

  private wishList = new WishListDto();

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: CoreToastService,
    private wishListStore: WishListStoreService,
    private router: Router,
    private loadingService: LoadingService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.wishList = this.router.getCurrentNavigation()?.extras?.state?.wishList;
    this.setupForm();
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName('wishlist_settings');
  }

  goBack() {
    this.navController.back();
  }

  async deleteWishList() {
    const header = 'Wunschliste löschen';
    const message = `Möchtest du deine Wunschliste ${this.wishList.name} wirklich löschen?`;
    const alert = await this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation);
    alert.present();
  }

  private onDeleteConfirmation = async () => {
    await this.loadingService.showLoadingSpinner();
    this.wishListStore.deleteWishList(this.wishList).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: async _ => {
        await this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht');
        this.router.navigateByUrl('/secure/home/wish-list-overview');
      },
      error: _ => {
        this.toastService.presentErrorToast('Beim Löschen deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

  async update() {
    if (this.form?.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    const wishList: WishListUpdateRequest = {
      id: this.wishList.id,
      name: this.form?.controls.name.value,
      showReservedWishes: this.form?.controls.showReservedWishes.value,
      date: this.form?.controls.date.value
    };
    await this.loadingService.showLoadingSpinner();
    this.wishListStore.updateWishList(wishList).pipe(
      first(),
      finalize(() => {
        this.loadingService.stopLoadingSpinner();
      })
    ).subscribe({
      next: wishList => {
        this.wishList = wishList;
        this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich aktualisiert.');
      },
      error: _ => {
        this.toastService.presentErrorToast('Bei der Aktualisierung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      }
    })
  }

  private setupForm() {
    const name = this.wishList?.name ? this.wishList.name : '';
    const date = this.wishList?.date ? new Date(this.wishList.date).toISOString() : '';
    const showReservedWishes = this.wishList?.showReservedWishes ? this.wishList?.showReservedWishes : false;
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(name, {
        validators: [Validators.required],
        updateOn: 'blur'
      }),
      date: this.formBuilder.control(date),
      showReservedWishes: this.formBuilder.control(showReservedWishes)
    });
  }
}
