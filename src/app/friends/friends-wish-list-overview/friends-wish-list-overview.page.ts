import { Component, OnInit } from '@angular/core';
import { FriendWishList } from '@friends/friends-wish-list-overview/friends-wish-list-overview.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FriendWishListStoreService } from '@core/services/friend-wish-list-store.service';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit {

  wishLists: FriendWishList[];

  constructor(
    private navContoller: NavController, 
    private route: ActivatedRoute,
    private friendWishListStore: FriendWishListStoreService
  ) {}

  ngOnInit() {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  selectWishList(wishList: FriendWishList) {
    this.navContoller.navigateForward(`secure/friends-home/wish-list/${wishList.id}`);
  }

  forceRefresh(event) {
    this.friendWishListStore.loadWishLists(true).subscribe(wishLists => {
      this.wishLists = wishLists;
    }, console.error, () => {
      event.target.complete();
    })
  }

}
