import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListCreateRequest, WishListCreateOrUpdateRequest, WishListUpdateRequest } from './wish-list-create-update.model';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListService } from '../shared/services/wish-list.service';
import { NavController } from '@ionic/angular';
import { WishListDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';
import { Subscription } from 'rxjs';
import { AlertService } from '../shared/services/alert.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-wish-list-create-update',
  templateUrl: './wish-list-create-update.page.html',
  styleUrls: ['./wish-list-create-update.page.scss'],
})
export class WishListCreateUpdatePage implements OnInit {

  private wishList: WishListDto;
  private subscription: Subscription;

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
    private wishListService: WishListService,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe( wishListDto => {
      this.wishList = wishListDto;
      this.initFormIfNotPresent();
    });
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
    let request: WishListCreateOrUpdateRequest = new WishListCreateOrUpdateRequest();
    request.name = this.form.controls.name.value;
    request.date = this.form.controls.date.value;
    request.partner = this.form.controls.partner.value;

    this.wishList && this.wishList.id ? this.update(request) : this.create(request);
  }

  private create(request: WishListCreateOrUpdateRequest) {
    this.apiService.create(request as WishListCreateRequest).subscribe( (response : WishListDto) => {
      this.wishListService.updateSelectedWishList(response);
      this.navController.navigateForward('/wish-list-edit');
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich erstellt.');
    }, e => {
      console.error(e);
      this.toastService.presentErrorToast('Bei der Erstellung deiner Wunschliste ist leider ein Fehler aufgetreten.');
    });
  }

  private update(request: WishListCreateOrUpdateRequest) {
    const updateRequest = request as WishListUpdateRequest;
    updateRequest.id = this.wishList.id;
    this.apiService.update(updateRequest).subscribe( (response : WishListDto) => {
      this.wishListService.updateSelectedWishList(response);
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich aktualisiert.');
    }, e => {
      console.error(e);
      this.toastService.presentErrorToast('Bei der Aktualisierung deiner Wunschliste ist leider ein Fehler aufgetreten.');
    });
  }

  deleteWishList() {
    const header = 'Wunschliste löschen';
    const message =  `Möchtest du deine Wunschliste ${this.wishList.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    })
  }

  private onDeleteConfirmation = (value) => {
    this.apiService.delete(this.wishList.id)
    .toPromise()
    .then(emptyResponse => {
      this.subscription.unsubscribe();
      this.toastService.presentSuccessToast('Deine Wunschliste wurde erfolgreich gelöscht');
      this.navController.navigateBack('home');
    })
    .catch( e => {
      console.log(e);
      this.toastService.presentErrorToast('Beim Löschen deiner Wunschliste ist leider ein Fehler aufgetreten.');
    });
  }

}
