import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListCreateRequest, WishListCreateOrUpdateRequest, WishListUpdateRequest } from './wish-list-create-update.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { IonDatetime, NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { AlertService } from '@core/services/alert.service';
import { ToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileStore } from '@menu/settings/user-profile-store.service';
import { UserWishListDto } from '@core/models/user.model';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'app-wish-list-create-update',
  templateUrl: './wish-list-create-update.page.html',
  styleUrls: ['./wish-list-create-update.page.scss'],
})
export class WishListCreateUpdatePage implements OnInit {

  private wishList: WishListDto;
  private userEmail: string;

  form: FormGroup;

  get minDate(): number { return new Date().getFullYear(); } 
  get maxDate(): number { return this.minDate + 10; }

  get title(): string {
    return  this.isUpdatePage ? 'Wunschliste bearbeiten' : 'Neue Wunschliste hinzufügen';
  }

  get buttonTitle(): string {
    return this.isUpdatePage ? 'Änderungen speichern' : 'Wunschliste anlegen' 
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
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.')
      ],
    }
  };

  get partner(): UserWishListDto {
    const owners = this.wishList?.owners;
    let partner = null;
    if (owners && owners.length > 1 && this.userEmail) {
      partner = owners.filter(userWishList => {
        return userWishList.email != this.userEmail;
      })[0];
    }
    return partner;
  }

  get isCreator(): boolean {
    return this.userEmail == this.wishList.creatorEmail;
  }

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: WishListApiService,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: ToastService,
    private wishListStore: WishListStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileStore: UserProfileStore,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.userProfileStore.loadUserProfile().subscribe(userProfile => {
      this.userEmail = userProfile.email.value;
    });
    this.initFormIfNotPresent();
  }

  initFormIfNotPresent() {
    if (!this.form) {
      const name = this.wishList && this.wishList.name ? this.wishList.name : '';
      const date = this.wishList && this.wishList.date ? this.wishList.date : '';

      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(name, [Validators.required]),
        'date': this.formBuilder.control(date, []),
      });
    }
  }

  goBack() {
    this.navController.back();
  }

  createOrUpdateWishList() {
    let request = new WishListCreateOrUpdateRequest();
    request.name = this.form.controls.name.value;
    request.date = this.form.controls.date.value;

    this.wishList && this.wishList.id ? this.update(request) : this.create(request);
  }

  private create(request: WishListCreateOrUpdateRequest) {
    this.loadingService.showLoadingSpinner();
    this.apiService.create(request as WishListCreateRequest).subscribe({
      next: createdWishList => {
        this.wishListStore.saveWishListToCache(createdWishList);
        this.wishList = createdWishList;
        this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich erstellt.');
        this.router.navigateByUrl(`/secure/home/wish-list/${createdWishList.id}`);
      },
      error: error => {
        this.toastService.presentErrorToast('Bei der Erstellung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      },
      complete: () => {
        this.loadingService.dismissLoadingSpinner();
      }
    });
  }

  private update(request: WishListCreateOrUpdateRequest) {
    const updateRequest = request as WishListUpdateRequest;
    updateRequest.id = this.wishList.id;
    this.loadingService.showLoadingSpinner();
    this.apiService.update(updateRequest).subscribe({
      next: updatedWishList => {
        this.wishListStore.updatedCachedWishList(updatedWishList);
        this.wishList = updatedWishList;
        this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich aktualisiert.');
      },
      error: error => {
        this.toastService.presentErrorToast('Bei der Aktualisierung deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
      },
      complete: () => {
        this.loadingService.dismissLoadingSpinner();
      }
    });
  }

  deleteWishList() {
    const header = 'Wunschliste löschen';
    const message =  `Möchtest du deine Wunschliste ${this.wishList.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    });
  }

  private onDeleteConfirmation = () => {
    this.loadingService.showLoadingSpinner();
    this.apiService.delete(this.wishList.id).toPromise().then(() => {
      this.wishListStore.removeCachedWishList(this.wishList.id);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht');
      this.router.navigateByUrl('/secure/home/wish-list-overview');
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht.');
    }, error => {
      this.toastService.presentErrorToast('Beim Löschen deiner Wunschliste ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.');
    }).finally(() => {
      this.loadingService.dismissLoadingSpinner();
    });
  }

}
