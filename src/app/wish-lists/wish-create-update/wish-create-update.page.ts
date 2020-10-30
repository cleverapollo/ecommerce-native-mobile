import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListApiService } from '@core/api/wish-list-api.service';
import { WishListDto, WishDto, WishListSelectOptionDto } from '@core/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '@shared/components/validation-messages/validation-message';
import { WishApiService } from '@core/api/wish-api.service';
import { AlertService } from '@core/services/alert.service';
import { WishListStoreService } from '@core/services/wish-list-store.service';

@Component({
  selector: 'app-wish-create-update',
  templateUrl: './wish-create-update.page.html',
  styleUrls: ['./wish-create-update.page.scss'],
})
export class WishCreateUpdatePage implements OnInit, OnDestroy {

  wish: WishDto
  wishList: WishListDto
  wishListSelectOptions: Array<WishListSelectOptionDto>

  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
      wishListId: [
        new ValidationMessage('required', 'Weise deinem Wunsch bitte eine Wunschliste zu.')
      ],
      name: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte eine Bezeichnung.')
      ],
      price: [
        new ValidationMessage('required', 'Vergib deinem Wunsch bitte einen Preis.')
      ]
    }
  }

  get title(): string {
    return  this.isUpdatePage ? 'Wunsch bearbeiten' : 'Wunsch hinzufügen';
  }

  get isUpdatePage(): boolean {
    return (this.wish && this.wish.id) ? true : false;
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private wishListApiService: WishListApiService,
    private wishApiService: WishApiService,
    private alertService: AlertService,
    private wishListStore: WishListStoreService
    ) { }

  ngOnInit() {
    this.initViewData();
    this.createForm();
  }

  private initViewData() {
    this.wish = this.route.snapshot.data.wish ? this.route.snapshot.data.wish : this.router.getCurrentNavigation().extras.state.searchResult;
    this.wishList = this.route.snapshot.data.wishList;
    this.wishListSelectOptions = this.route.snapshot.data.wishListSelectOptions;
  }

  private createForm() {
    let wishListId = null;
    if (this.isUpdatePage) {
      wishListId = this.wish.wishListId;
    } else if (this.wishList) {
      wishListId = this.wishList.id;
    }
    const name = this.wish.name ? this.wish.name : '';
    const price = this.wish.price ? this.wish.price : '';
    this.form = this.formBuilder.group({
      'wishListId': this.formBuilder.control(wishListId, [Validators.required]),
      'name': this.formBuilder.control(name, [Validators.required]),
      'price': this.formBuilder.control(price, [Validators.required]),
    });
  }

  ngOnDestroy(): void {}

  createOrUpdateWish() {
    if (this.isUpdatePage) {
      this.updateWish();
    } else {
      this.createWish();
    }
  }

  deleteWish() {
    const header = 'Wunsch löschen';
    const message = `Möchtest du deinen Wunsch ${this.wish.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    })
  }

  private onDeleteConfirmation = (value) => {
    this.wishListApiService.removeWish(this.wish).toPromise().then( emptyResponse => {
      this.wishListStore.removeWishFromCache(this.wish);
      this.router.navigate([`secure/home/wish-list/${this.wish.wishListId}`]);
    });
  }

  private createWish() {
    const wishListId = this.form.controls.wishListId.value;
    this.wish.wishListId = wishListId;
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value;
    this.wishApiService.createWish(this.wish).toPromise().then(createdWish => { 
        this.wishListStore.saveWishToCache(createdWish);
        this.router.navigate([`secure/home/wish-list/${wishListId}`]);
    });
  }

  private updateWish() {
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value; 
    this.wishApiService.update(this.wish).toPromise().then(updatedWish => { 
        this.wishListStore.updateCachedWish(updatedWish);
    });
  }

}
