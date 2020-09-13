import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListService } from '../shared/services/wish-list.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { WishListDto, WishDto, WishListSelectOptionDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/components/validation-messages/validation-message';
import { WishApiService } from '../shared/api/wish-api.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-wish-create-update',
  templateUrl: './wish-create-update.page.html',
  styleUrls: ['./wish-create-update.page.scss'],
})
export class WishCreateUpdatePage implements OnInit, OnDestroy {

  private wishSubscription: Subscription
  private wishListSubscription: Subscription;

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
    private wishListService: WishListService,
    private wishListApiService: WishListApiService,
    private wishApiService: WishApiService,
    private alertService: AlertService
    ) { }

  ngOnInit() {
    this.wishListSelectOptions = this.route.snapshot.data.wishListSelectOptions;
    this.wishSubscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
      this.form = this.formBuilder.group({
        'wishListId': this.formBuilder.control(this.wish.wishListId, [Validators.required]),
        'name': this.formBuilder.control(this.wish.name, [Validators.required]),
        'price': this.formBuilder.control(this.wish.price, [Validators.required]),
      });
    }, e => console.error(e));
    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
  }

  ngOnDestroy(): void {
    this.wishListSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
  }

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
      const wishIndex = this.wishList.wishes.findIndex( w => w.id == this.wish.id );
      if (wishIndex > -1) {
        this.wishList.wishes.splice(wishIndex, 1);
        this.wishListService.updateSelectedWishList(this.wishList);
      }
      this.wishListService.updateSelectedWish(null);
      this.router.navigate(['wish-list-detail']);
    }, console.error);
  }

  private createWish() {
    this.wish.wishListId = this.form.controls.wishListId.value;
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value;
    this.wishListApiService.addWish(this.wish).toPromise().then( (updatedWishList: WishListDto) => { 
        this.wishListService.updateSelectedWishList(updatedWishList);
        this.router.navigate(['wish-list-detail']);
      }, console.error);
  }

  private updateWish() {
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value; 
    this.wishApiService.update(this.wish).toPromise().then( (updatedWish: WishDto) => { 
        this.wishListService.updateSelectedWish(updatedWish);
    }, console.error);
  }

}
