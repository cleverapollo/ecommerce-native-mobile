import { Component, OnInit, OnDestroy } from '@angular/core';
import { Wish, WishList } from '../home/wishlist.model';
import { WishListService } from '../shared/services/wish-list.service';
import { Subscription } from 'rxjs';
import { WishListApiService } from '../shared/services/wish-list-api.service';
import { Router } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';

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

  constructor(
    private router: Router, 
    public alertService: AlertService,
    private wishListService: WishListService, 
    private wishListApiService: WishListApiService
    ) { }

  ngOnInit() {
    this.wishListSubscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });

    this.subscription = this.wishListService.selectedWish$.subscribe(w => {
      this.wish = w;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.wishListSubscription.unsubscribe();
  }

  deleteWish() {
    const header = 'Wunsch löschen';
    const message = `Möchtest du deinen Wunsch ${this.wish.name} wirklich löschen?`;
    this.alertService.createDeleteAlert(header, message, this.onDeleteConfirmation).then( alert => {
      alert.present();
    })
  }

  private onDeleteConfirmation = (value) => {
    this.wishListApiService.removeWish(this.wish)
    .toPromise()
    .then( emptyResponse => {
      const wishIndex = this.wishList.wishes.findIndex( w => w.id == this.wish.id );
      if (wishIndex > -1) {
        this.wishList.wishes.splice(wishIndex, 1);
        this.wishListService.updateSelectedWishList(this.wishList);
      }
      this.wishListService.updateSelectedWish(null);
      this.router.navigate(['wish-list-detail']);
    })
    .catch( e => console.error(e));
  }

}
