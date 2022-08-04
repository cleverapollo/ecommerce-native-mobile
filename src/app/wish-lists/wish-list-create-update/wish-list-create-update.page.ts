import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListCreateRequest, WishListCreateOrUpdateRequest, WishListUpdateRequest } from './wish-list-create-update.model';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { AlertService } from '@core/services/alert.service';
import { CoreToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { UserWishListDto } from '@core/models/user.model';
import { LoadingService } from '@core/services/loading.service';
import { CustomValidation } from '@shared/custom-validation';
import { AnalyticsService } from '@core/services/analytics.service';

@Component({
  selector: 'app-wish-list-create-update',
  templateUrl: './wish-list-create-update.page.html',
  styleUrls: ['./wish-list-create-update.page.scss'],
})
export class WishListCreateUpdatePage implements OnInit {

  form: FormGroup;
  /** ISO Date string */
  minDate: string;

  get title(): string {
    return  this.isUpdatePage ? 'Wunschliste bearbeiten' : 'Neue Wunschliste hinzufügen';
  }

  get buttonTitle(): string {
    return this.isUpdatePage ? 'Änderungen speichern' : 'Wunschliste anlegen'
  }

  get screenName(): string {
    return this.isUpdatePage ? 'wishlist_settings' : 'wishlist_add'
  }

  get isUpdatePage(): boolean {
    return (this.wishList && this.wishList.id) ? true : false;
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

  get partner(): UserWishListDto {
    const owners = this.wishList?.owners;
    let partner = null;
    if (owners && owners.length > 1 && this.userEmail) {
      partner = owners.filter(userWishList => {
        return userWishList.email !== this.userEmail;
      })[0];
    }
    return partner;
  }

  get isCreator(): boolean {
    return this.userEmail === this.wishList.creatorEmail;
  }

  private wishList: WishListDto;
  private userEmail: string;

  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: CoreToastService,
    private wishListStore: WishListStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileStore: UserProfileStore,
    private loadingService: LoadingService,
    private analyticsService: AnalyticsService
  ) { }

  async ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.minDate = new Date().toISOString();
    await this.setupUserEmail();
    this.setupForm();
  }

  private async setupUserEmail() {
    const userProfile = await this.userProfileStore.loadUserProfile().toPromise();
    this.userEmail = userProfile.email.value;
  }

  async ionViewWillEnter() {
    if (this.isUpdatePage) {
      this.wishList = await this.wishListStore.loadWishList(this.wishList.id).toPromise();
      this.setupForm();
    }
  }

  ionViewDidEnter() {
    this.analyticsService.setFirebaseScreenName(this.screenName);
  }

  goBack() {
    this.navController.back();
  }

  createOrUpdateWishList() {
    if (this.form.invalid) {
      CustomValidation.validateFormGroup(this.form);
      return;
    }
    const request: WishListCreateOrUpdateRequest = {
      name:  this.form.controls.name.value,
      showReservedWishes: this.form.controls.showReservedWishes.value,
      date: this.form.controls.date.value
    };
    this.wishList && this.wishList.id ? this.update(request) : this.create(request);
  }

  async deleteWishList() {
    const header = 'Wunschliste löschen';
    const message =  `Möchtest du deine Wunschliste ${this.wishList.name} wirklich löschen?`;
    const alert = await this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation);
    alert.present();
  }

  private onDeleteConfirmation = async () => {
    this.loadingService.showLoadingSpinner();

    try {
      await this.wishListStore.deleteWishList(this.wishList.id);
      this.loadingService.dismissLoadingSpinner();
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht');
      this.router.navigateByUrl('/secure/home/wish-list-overview');
    } catch (error) {
      this.loadingService.dismissLoadingSpinner();
      this.toastService.presentErrorToast('Beim Löschen deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
    }
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

  private async create(request: WishListCreateOrUpdateRequest) {
    this.loadingService.showLoadingSpinner();

    try {
      const createdWishList = await this.wishListStore.createWishList(request as WishListCreateRequest);
      this.wishList = createdWishList;
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich erstellt.');
      this.loadingService.dismissLoadingSpinner();
      this.router.navigateByUrl(`/secure/home/wish-list/${createdWishList.id}`);
    } catch (error) {
      this.toastService.presentErrorToast('Bei der Erstellung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      this.loadingService.dismissLoadingSpinner();
    }
  }

  private async update(request: WishListCreateOrUpdateRequest) {
    this.loadingService.showLoadingSpinner();

    const updateRequest = request as WishListUpdateRequest;
    updateRequest.id = this.wishList.id;
    try {
      this.wishList = await this.wishListStore.updateWishList(updateRequest);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich aktualisiert.');
      this.loadingService.dismissLoadingSpinner();
    } catch (error) {
      this.toastService.presentErrorToast('Bei der Aktualisierung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      this.loadingService.dismissLoadingSpinner();
    }
  }
}
