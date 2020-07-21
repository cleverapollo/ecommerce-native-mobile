import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListService } from '../shared/services/wish-list.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListApiService } from '../shared/api/wish-list-api.service';
import { NavController } from '@ionic/angular';
import { WishListDto, WishDto, WishListSelectOptionDto } from '../shared/models/wish-list.model';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';

@Component({
  selector: 'app-wish-new',
  templateUrl: './wish-new.page.html',
  styleUrls: ['./wish-new.page.scss'],
})
export class WishNewPage implements OnInit, OnDestroy {

  private wishSubscription: Subscription
  
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

  wish: WishDto

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private wishListService: WishListService,
    private wishListApiService: WishListApiService,
    private navController: NavController
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
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
  }

  saveWish() {
    this.wish.wishListId = this.form.controls.wishListId.value;
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value;
    this.wishListApiService.addWish(this.wish)
      .toPromise()
      .then( (updatedWishList: WishListDto) => { 
        this.wishListService.updateSelectedWishList(updatedWishList);
        this.router.navigate(['wish-list-detail']);
      })
      .catch( e => console.error(e) );
  }

  goBack() {
    this.navController.back();
  }

}
