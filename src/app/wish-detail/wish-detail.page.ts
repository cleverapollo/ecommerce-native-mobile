import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wish, WishList } from '../home/wishlist.model';
import { WishListService } from '../shared/services/wish-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription;
  private wishListSubscription: Subscription;

  wishList: WishList
  wish: Wish

  constructor(private wishListService: WishListService) { }

  ngOnInit() {
    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });

    this.subscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
    });

    console.log(this.wish.imageUrl)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }

}
