import { Component, OnInit } from '@angular/core';
import { FriendWishList, FriendWish } from './friends-wish-list-overview.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FriendWishListService } from '../shared/services/friend-wish-list.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-friends-wish-list-overview',
  templateUrl: './friends-wish-list-overview.page.html',
  styleUrls: ['./friends-wish-list-overview.page.scss'],
})
export class FriendsWishListOverviewPage implements OnInit {

  testData: FriendWishList = new FriendWishList()

  wishLists: [FriendWishList];

  constructor(
    private navContoller: NavController, 
    private route: ActivatedRoute,
    private wishListService: FriendWishListService
  ) {
    this.wishLists = this.route.snapshot.data.wishLists;
  }

  ngOnInit() {}

  selectWishList(wishList: FriendWishList) {
    this.wishListService.updateSelectedWishList(wishList);
    this.navContoller.navigateForward('tabs/friends-wish-list-overview/friends-wish-list-detail');
  }

}
