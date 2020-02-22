import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WishListService } from '../shared/services/wish-list.service';
import { Wish, WishListSelectOption, WishList } from '../home/wishlist.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WishListApiService } from '../shared/services/wish-list-api.service';

@Component({
  selector: 'app-wish-new',
  templateUrl: './wish-new.page.html',
  styleUrls: ['./wish-new.page.scss'],
})
export class WishNewPage implements OnInit, OnDestroy {

  private wishSubscription: Subscription
  
  wishListSelectOptions: Array<WishListSelectOption>
  form: FormGroup
  wish: Wish

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private formBuilder: FormBuilder, 
    private wishListService: WishListService,
    private wishListApiService: WishListApiService
    ) { }

  ngOnInit() {
    this.wishListSelectOptions = this.route.snapshot.data.wishListSelectOptions;
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

  compareWithFn = (o1: WishListSelectOption, o2: WishListSelectOption) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  saveWish() {
    this.wish.wishListId = this.form.controls.wishListId.value;
    this.wish.name = this.form.controls.name.value;
    this.wish.price = this.form.controls.price.value;

    this.wishListApiService.addWish(this.wish)
      .toPromise()
      .then( (updatedWishList: WishList) => { 
        this.wishListService.updateSelectedWishList(updatedWishList);
        this.router.navigate(['wish-list-detail']);
      })
      .catch( e => console.error(e) );
  }

}
