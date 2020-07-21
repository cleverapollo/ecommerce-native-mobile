import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WishListSelectOptionDto, WishDto, WishListDto } from '../shared/models/wish-list.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListService } from '../shared/services/wish-list.service';
import { NavController } from '@ionic/angular';
import { WishApiService } from '../shared/api/wish-api.service';
import { ValidationMessages, ValidationMessage } from '../shared/validation-messages/validation-message';

@Component({
  selector: 'app-wish-edit',
  templateUrl: './wish-edit.page.html',
  styleUrls: ['./wish-edit.page.scss'],
})
export class WishEditPage implements OnInit {

  private wishSubscription: Subscription
  private wishListSubscription: Subscription

  wishListName: String;
  
  wishListSelectOptions: Array<WishListSelectOptionDto>
  form: FormGroup;
  get validationMessages(): ValidationMessages {
    return {
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
    private wishApiService: WishApiService,
    private navController: NavController
    ) { }

  ngOnInit() {
    this.wishListSelectOptions = this.route.snapshot.data.wishListSelectOptions;
    this.wishSubscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
      this.form = this.formBuilder.group({
        'name': this.formBuilder.control(this.wish.name, [Validators.required]),
        'price': this.formBuilder.control(this.wish.price, [Validators.required]),
      });
    }, e => console.error(e));

    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe(w => {
      if (w) {
        this.wishListName = w.name;
      }
    });
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }

  saveWish() {
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value; 
    this.wishApiService.update(this.wish).toPromise().then( (updatedWish: WishDto) => { 
        this.wishListService.updateSelectedWish(updatedWish);
    }).catch( e => console.error);
  }

  goBack() {
    this.navController.back();
  }

}
