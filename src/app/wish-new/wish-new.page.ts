import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListService } from '../shared/services/wish-list.service';
import { Wish } from '../home/wishlist.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-new',
  templateUrl: './wish-new.page.html',
  styleUrls: ['./wish-new.page.scss'],
})
export class WishNewPage implements OnInit, OnDestroy {

  private wishSubscription: Subscription

  form: FormGroup
  wish: Wish

  constructor(private formBuilder: FormBuilder, private wishListService: WishListService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      'wishListId': this.formBuilder.control('', [Validators.required]),
      'name': this.formBuilder.control('', [Validators.required]),
      'price': this.formBuilder.control('', [Validators.required]),
    });
    this.wishSubscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
      this.form.controls.name.setValue(this.wish.name);
      this.form.controls.price.setValue(this.wish.price);
      this.form.controls.wishListId.setValue(this.wish.wishListId);
    }, e => console.error(e));
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
  }

}
