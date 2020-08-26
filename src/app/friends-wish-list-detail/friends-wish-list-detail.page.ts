import { Component, OnInit, OnDestroy } from '@angular/core';
import { FriendWishList, FriendWish } from '../friends-wish-list-overview/friends-wish-list-overview.model';
import { Subscription } from 'rxjs';
import { FriendWishListService } from '../shared/services/friend-wish-list.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit, OnDestroy {

  private subscription: Subscription

  wishList: FriendWishList

  constructor(private wishListService: FriendWishListService, private navController: NavController) { }

  ngOnInit() {
    this.subscription = this.wishListService.selectedWishList$.subscribe(w => {
      this.wishList = w;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.navController.navigateBack('/friends-wish-list-overview');
  }

  updateWish(updatedWish: FriendWish) {
    const index = this.wishList.wishes.findIndex( w => w.id === updatedWish.id );
    if (index !== -1) {
      this.wishList.wishes[index] = updatedWish;
      this.wishListService.updateSelectedWishList(this.wishList);
    }
  } 

  get ownerProfileImageUrls(): String[] {
    const imagesUrls = this.wishList.owners
        .filter(o => o.profileImageUrl !== null)
        .map(o => o.profileImageUrl);
    return imagesUrls;
  }
}
