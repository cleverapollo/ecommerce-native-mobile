import { Component, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';

@Component({
  selector: 'app-friends-wish-list-detail',
  templateUrl: './friends-wish-list-detail.page.html',
  styleUrls: ['./friends-wish-list-detail.page.scss'],
})
export class FriendsWishListDetailPage implements OnInit {

  wishList: FriendWishList

  constructor(
    private navController: NavController, 
    private route: ActivatedRoute,
    private friendWishListStore: FriendWishListStoreService) { }

  ngOnInit() {
    this.wishList = this.route.snapshot.data.wishList;
    console.log(this.wishList);
  }

  goBack() {
    this.navController.navigateBack('/friends-wish-list-overview');
  }

  updateWish(updatedWish: FriendWish) {
    const index = this.wishList.wishes.findIndex( w => w.id === updatedWish.id );
    if (index !== -1) {
      this.wishList.wishes[index] = updatedWish;
      this.friendWishListStore.updateCachedWishList(this.wishList);
    }
  } 

  get ownerProfileImageUrls(): String[] {
    const imagesUrls = this.wishList.owners
        .filter(o => o.profileImageUrl !== null)
        .map(o => o.profileImageUrl);
    return imagesUrls;
  }

  forceRefresh(event) {
    this.friendWishListStore.loadWishList(this.wishList.id, true).subscribe(wishList => {
      this.wishList = wishList;
    }, console.error, () => {
      event.target.complete();
    })
  }
}
