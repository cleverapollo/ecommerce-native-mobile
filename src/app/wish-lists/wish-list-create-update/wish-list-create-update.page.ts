import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListCreateRequest, WishListCreateOrUpdateRequest, WishListUpdateRequest } from './wish-list-create-update.model';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { NavController } from '@ionic/angular';
import { WishListDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { Subscription } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { ToastService } from '@core/services/toast.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wish-list-create-update',
  templateUrl: './wish-list-create-update.page.html',
  styleUrls: ['./wish-list-create-update.page.scss'],
})
export class WishListCreateUpdatePage implements OnInit {

  private wishList: WishListDto;

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
      date: [
        new ValidationMessage('required', 'Gib bitte ein Datum an, an welches deine Wunschliste gebunden ist.')
      ],
      partnerName: [],
      partnerEmail: [
        new ValidationMessage('email', 'Das Format der E-Mail Adresse ist ungültig.')
      ],
    }
  };

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: WishListApiService,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: ToastService,
    private wishListStore: WishListStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    this.initFormIfNotPresent();
  }

  initFormIfNotPresent() {
    if (!this.form) {
      const name = this.wishList && this.wishList.name ? this.wishList.name : '';
      const date = this.wishList && this.wishList.date ? this.wishList.date : '';

      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(name, [Validators.required]),
        'date': this.formBuilder.control(date, [Validators.required]),
        'partner': this.formBuilder.group({
          'email': this.formBuilder.control(null, [Validators.email]),
          'name': this.formBuilder.control(null, []),
        })
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
    request.partner = this.form.controls.partner.value;

    this.wishList && this.wishList.id ? this.update(request) : this.create(request);
  }

  private create(request: WishListCreateOrUpdateRequest) {
    this.apiService.create(request as WishListCreateRequest).subscribe( createdWishList => {
      this.wishListStore.saveWishListToCache(createdWishList);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich erstellt.');
      this.router.navigateByUrl(`/secure/home/wish-list/${createdWishList.id}`);
    });
  }

  private update(request: WishListCreateOrUpdateRequest) {
    const updateRequest = request as WishListUpdateRequest;
    updateRequest.id = this.wishList.id;
    this.apiService.update(updateRequest).subscribe( updatedWishList => {
      this.wishListStore.updatedCachedWishList(updatedWishList);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich aktualisiert.');
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
    this.apiService.delete(this.wishList.id).toPromise().then(() => {
      this.wishListStore.removeCachedWishList(this.wishList.id);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht');
      this.router.navigateByUrl('/secure/home/wish-list-overview');
    });
  }

}
